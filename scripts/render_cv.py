"""Render a readable CV page from the same PDF used for downloads.

Requires Poppler's pdftotext. The source LaTeX remains in the private CV repo.
"""
import html
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

pdf = Path(sys.argv[1])
page = Path(sys.argv[2])
start_marker = '<!-- CV_CONTENT_START -->'
end_marker = '<!-- CV_CONTENT_END -->'

result = subprocess.run(
    ['pdftotext', '-layout', '-enc', 'UTF-8', str(pdf), '-'],
    check=True, capture_output=True, text=True,
)
raw_lines = result.stdout.splitlines()
lines = [unicodedata.normalize('NFKC', line).strip() for line in raw_lines]
lines = [line for line in lines if not re.fullmatch(r'\d+/\d+', line)]
first_section = next((i for i, line in enumerate(lines) if line == 'Education'), None)
if first_section is None:
    raise SystemExit('Could not find the Education section in the CV PDF')
header = ' '.join(lines[:first_section])

known_headings = {
    'Education', 'Research Interest', 'Research Interests', 'Honors & Awards',
    'Publication', 'Publications', 'Research & Project Experience',
    'Professional Experience', 'Skill Set', 'Skills',
}

def heading(line, previous_blank):
    if line in known_headings:
        return True
    return previous_blank and 2 <= len(line) <= 52 and line.istitle() and not any(c in line for c in '.:,')

sections = []
current = None
previous_blank = True
for line in lines[first_section:]:
    if not line:
        previous_blank = True
        continue
    if heading(line, previous_blank):
        current = (line, [])
        sections.append(current)
    elif current is not None:
        current[1].append(line)
    previous_blank = False

if len(sections) < 4:
    raise SystemExit('Too few CV sections extracted; check the PDF before publishing')

def escape(value):
    return html.escape(value, quote=True)

def joined(parts):
    """Undo PDF line wrapping, including words hyphenated at line ends."""
    output = ''
    for part in parts:
        if output.endswith('-') and part[:1].islower():
            word = re.search(r'([A-Za-z]+)-$', output)
            output = (output[:-1] if word and word.group(1)[:1].isupper() else output) + part
        else:
            output += (' ' if output else '') + part
    return output

def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')

def row_parts(line):
    parts = re.split(r'\s{3,}', line)
    return (parts[0].strip(), ' '.join(parts[1:]).strip()) if len(parts) > 1 else None

out = ['<div class="cv-readable" aria-label="Curriculum vitae text">']
contacts = []
phone = re.search(r'\+\d[\d ]{7,}', header)
if phone:
    value = phone.group().strip()
    number = re.sub(r'[^+\d]', '', value)
    contacts.append(f'<a href="tel:{number}">{escape(value)}</a>')
for email in dict.fromkeys(re.findall(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}', header)):
    contacts.append(f'<a href="mailto:{escape(email)}">{escape(email)}</a>')
if contacts:
    out.append('<div class="cv-readable-contact">' + ' · '.join(contacts) + '</div>')

for title, content in sections:
    out.append(f'<section class="cv-readable-section" id="{slug(title)}"><h2>{escape(title)}</h2>')
    if title.startswith('Honors'):
        out.append('<ul class="cv-readable-list">')
        out.extend(f'<li>{escape(line)}</li>' for line in content)
        out.append('</ul>')
    elif title in ('Research Interest', 'Research Interests'):
        out.append(f'<p>{escape(joined(content))}</p>')
    elif title in ('Skill Set', 'Skills'):
        out.append('<dl class="cv-readable-skills">')
        for line in content:
            if ':' in line:
                key, value = line.split(':', 1)
                out.append(f'<div><dt>{escape(key)}</dt><dd>{escape(value.strip())}</dd></div>')
            elif out[-1].startswith('<div><dt>'):
                out[-1] = out[-1].replace('</dd></div>', ' ' + escape(line) + '</dd></div>')
            else:
                out.append(f'<div><dd>{escape(line)}</dd></div>')
        out.append('</dl>')
    elif title in ('Publication', 'Publications') and content:
        out.append(f'<h3>{escape(content[0])}</h3>')
        if len(content) > 1:
            out.append(f'<p>{escape(joined(content[1:]))}</p>')
    else:
        paragraph = []
        def flush():
            if paragraph:
                out.append(f'<p>{escape(joined(paragraph))}</p>')
                paragraph.clear()
        for i, line in enumerate(content):
            parts = row_parts(line)
            if parts:
                flush()
                out.append(f'<div class="cv-readable-row"><span>{escape(parts[0])}</span><span>{escape(parts[1])}</span></div>')
                continue
            next_line = content[i + 1] if i + 1 < len(content) else ''
            if next_line.startswith(('Research Assistant;', 'Intern')) or (
                title == 'Professional Experience' and next_line.startswith('Intern')
            ):
                flush()
                out.append(f'<h3>{escape(line)}</h3>')
                continue
            wrapped = (line[:1].islower() or line[:1].isdigit() or
                       paragraph and paragraph[-1].endswith(('-', ',', ' and')) or
                       title == 'Education' and paragraph and len(paragraph[-1]) > 95 and not paragraph[-1].endswith(('.', ':', ';')))
            if paragraph and not wrapped:
                flush()
            paragraph.append(line)
        flush()
    out.append('</section>')
out.append('</div>')

source = page.read_text()
if source.count(start_marker) != 1 or source.count(end_marker) != 1:
    raise SystemExit('CV content markers missing or duplicated in website page')
begin = source.index(start_marker) + len(start_marker)
end = source.index(end_marker)
page.write_text(source[:begin] + '\n' + '\n'.join(out) + '\n' + source[end:])
print(f'Rendered {len(sections)} readable CV sections from {pdf}')

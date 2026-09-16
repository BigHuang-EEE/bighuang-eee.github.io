"""Check every local HTML/CSS URL, responsive image, and document anchor."""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'site').resolve()
prefix = '/' + sys.argv[2].strip('/') if len(sys.argv) > 2 and sys.argv[2].strip('/') else ''
errors, documents = [], {}

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            return
        for key in ('href', 'src', 'poster', 'data-src'):
            if attrs.get(key):
                self.refs.append(attrs[key])
        if attrs.get('srcset'):
            self.refs.extend(item.strip().split()[0] for item in attrs['srcset'].split(',') if item.strip())

for file in root.rglob('*.html'):
    doc = Document()
    doc.feed(file.read_text())
    documents[file] = doc

checked = 0
def check(file, value):
    global checked
    if not value or value.startswith(('data:', 'mailto:', 'tel:', 'javascript:', '//')):
        return
    if urlsplit(value).scheme:
        return
    page = prefix + '/' + file.relative_to(root).as_posix()
    resolved = urlsplit(urljoin('http://local' + page, value))
    pathname = unquote(resolved.path)
    if prefix and not pathname.startswith(prefix + '/'):
        errors.append(f'{file.relative_to(root)}: escapes base path: {value}')
        return
    target = root / pathname[len(prefix):].lstrip('/')
    if target.is_dir():
        target /= 'index.html'
    checked += 1
    if not target.is_file():
        errors.append(f'{file.relative_to(root)}: missing {value}')
    elif resolved.fragment and target in documents:
        anchor = unquote(resolved.fragment)
        if anchor and anchor not in documents[target].ids:
            errors.append(f'{file.relative_to(root)}: missing anchor {value}')

for file, doc in documents.items():
    for value in doc.refs:
        check(file, value)
for file in root.rglob('*.css'):
    for match in re.finditer(r'url\(\s*[\'\"]?([^\s)\'\"]+)', file.read_text()):
        check(file, match.group(1))

if not documents:
    errors.append('No HTML pages found')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(documents)} HTML pages; {checked} local links, assets and anchors; base={prefix or "/"}')

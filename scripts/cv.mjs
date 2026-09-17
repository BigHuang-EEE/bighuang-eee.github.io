import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
export const cvNames = ['Huang-Xiwen-CV.pdf', 'CV_general.pdf'];

// Local development uses the sibling private repo; CI uses its synced snapshot.
export async function readCV() {
  const source = process.env.CV_SOURCE
    ? path.resolve(project, process.env.CV_SOURCE)
    : path.resolve(project, '../CV/Huang-Xiwen-CV.pdf');
  let bytes;
  let selected = source;
  try {
    bytes = await readFile(source);
  } catch (error) {
    if (process.env.CV_SOURCE || error.code !== 'ENOENT') throw error;
    selected = path.join(project, 'site/assets/pdf/Huang-Xiwen-CV.pdf');
    bytes = await readFile(selected);
  }
  if (bytes.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error(`CV source is not a PDF: ${selected}`);
  }
  return { bytes, source: selected, version: createHash('sha256').update(bytes).digest('hex').slice(0, 16) };
}

export async function writeCV(directory, cv) {
  for (const name of cvNames) {
    await writeFile(path.join(directory, 'assets/pdf', name), cv.bytes);
  }
}

export function versionCVLinks(html, version) {
  return html.replace(/(\b(?:href|src)=["']\/assets\/pdf\/(?:Huang-Xiwen-CV|CV_general)\.pdf)(?:\?[^"'#]*)?/g,
    `$1?v=${version}`);
}

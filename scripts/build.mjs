import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCV, writeCV, versionCVLinks } from './cv.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const configuredUrl = process.env.SITE_URL ?? config.siteUrl;
const parsedUrl = configuredUrl ? new URL(configuredUrl) : null;
if (parsedUrl && !['https:', 'http:'].includes(parsedUrl.protocol)) {
  throw new Error('siteUrl must be an http(s) URL.');
}
const basePath = (process.env.BASE_PATH ?? (parsedUrl ? parsedUrl.pathname : config.basePath) ?? '')
  .replace(/^\/+|\/+$/g, '');
if (basePath && !/^[a-zA-Z0-9_./-]+$/.test(basePath)) throw new Error('Invalid basePath.');
const prefix = basePath ? `/${basePath}` : '';
const siteUrl = `${parsedUrl?.origin ?? 'http://localhost:4173'}${prefix}`;
const output = path.join(root, 'dist');
const cv = await readCV();
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'site'), output, { recursive: true });
await writeCV(output, cv);
console.log(`CV: ${cv.source} (${cv.version})`);

async function transform(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await transform(file); continue; }
    if (!/\.(html|css|js|xml|txt)$/.test(entry.name)) continue;
    let text = await readFile(file, 'utf8');
    // Rewrite only URL-bearing attributes; preserve text, scripts, and layout.
    if (entry.name.endsWith('.html')) {
      text = versionCVLinks(text, cv.version);
      text = text.replace(/\b(href|src|action|poster|data-src)=(['"])\/(?!\/)/g, `$1=$2${prefix}/`);
      text = text.replace(/\bsrcset=(['"])(.*?)\1/g, (_, quote, value) =>
        `srcset=${quote}${value.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}/`)}${quote}`);
    }
    if (entry.name.endsWith('.css')) {
      text = text.replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}/`);
    }
    if (entry.name.endsWith('.js')) {
      text = text.replace(/(['"])\/assets\//g, `$1${prefix}/assets/`);
    }
    text = text.replaceAll('https://bighuang-eee.github.io/xiwen-huang.github.io', siteUrl);
    text = text.replaceAll('https://bighuang-eee.github.io', siteUrl);
    await writeFile(file, text);
  }
}
await transform(output);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Built dist/ for ${siteUrl}/`);

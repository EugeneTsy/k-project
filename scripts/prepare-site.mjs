import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const files = ['index.html', 'styles.css', 'site.mjs', 'config.mjs', 'favicon.svg', 'assets/portrait.webp', 'assets/portrait-2021.jpg', 'assets/portrait-half.jpg',
  'assets/icons/telegram-logo.svg', 'assets/icons/instagram-glyph-black.svg',
  'assets/icons/open_in_new.svg', 'assets/icons/arrow_upward.svg', 'assets/icons/LICENSE-Material-Icons.txt',
  'assets/fonts/PT_Sans-Web-Regular.woff2', 'assets/fonts/PT_Sans-Web-Bold.woff2',
  'assets/fonts/PT_Serif-Web-Regular.woff2', 'assets/fonts/OFL-PT-Sans.txt',
  'assets/fonts/OFL-PT-Serif.txt'];

const html = await readFile(new URL('index.html', root), 'utf8');
if (!html.includes('<html lang="ru">') || !html.includes('id="contact"')) {
  throw new Error('The page is incomplete; publication stopped.');
}
for (const file of files) {
  const metadata = await stat(new URL(file, root));
  if (!metadata.isFile() || metadata.size === 0) throw new Error(`Missing or empty file: ${file}`);
}
for (const image of ['assets/portrait.webp', 'assets/portrait-2021.jpg', 'assets/portrait-half.jpg']) {
  const metadata = await stat(new URL(image, root));
  if (metadata.size > 300_000) throw new Error(`${image} exceeds the 300 KB limit.`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of files) {
  const target = new URL(file, dist);
  await mkdir(new URL('.', target), { recursive: true });
  await cp(new URL(file, root), target);
}
console.log(`Publication files checked and copied to ${dist.pathname}`);

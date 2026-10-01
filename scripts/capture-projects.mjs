import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/projects', { recursive: true });
await mkdir('research', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [name, url] of [
    ['techstore', 'https://dalytechie.github.io/phoneshop_soc/'],
    ['flowers', 'https://dalytechie.github.io/lylyflowerstore.githup.io/'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) throw new Error(`${name}: ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `research/${name}.png` });
    await sharp(`research/${name}.png`).webp({ quality: 85 }).toFile(`public/projects/${name}.webp`);
    console.log(`${name}: captured actual public interface`);
    await page.close();
  }
  const portrait = await fetch('https://dalytechie.github.io/kuydaly_portfolio/img.JPG');
  if (!portrait.ok) throw new Error(`portrait: ${portrait.status}`);
  await sharp(Buffer.from(await portrait.arrayBuffer())).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 84 }).toFile('public/daly.webp');
} finally { await browser.close(); }

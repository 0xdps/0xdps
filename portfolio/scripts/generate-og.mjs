/**
 * Generates public/og-banner.png from an inline SVG design.
 * Run once: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../public/og-banner.png');

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0a0e17"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <!-- Glow for accent elements -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Subtle radial highlight top-left -->
    <radialGradient id="hl" cx="0%" cy="0%" r="70%">
      <stop offset="0%"   stop-color="#58a6ff" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#58a6ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Base background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#hl)"/>

  <!-- Subtle grid lines -->
  ${Array.from({ length: 20 }, (_, i) =>
    `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="${H}" stroke="#1c2333" stroke-width="1" opacity="0.5"/>`
  ).join('')}
  ${Array.from({ length: 11 }, (_, i) =>
    `<line x1="0" y1="${i * 64}" x2="${W}" y2="${i * 64}" stroke="#1c2333" stroke-width="1" opacity="0.5"/>`
  ).join('')}

  <!-- Left accent bar -->
  <rect x="0" y="0" width="5" height="${H}" fill="#58a6ff"/>

  <!-- Top bar (like a VS Code title bar) -->
  <rect x="0" y="0" width="${W}" height="38" fill="#010409"/>
  <rect x="0" y="38" width="${W}" height="1" fill="#30363d"/>
  <text x="24" y="25" font-family="ui-monospace,monospace" font-size="13" fill="#484f58">0xdps — portfolio · dps.codes</text>
  <!-- Window dots -->
  <circle cx="${W - 44}" cy="19" r="6" fill="#ff5f57" opacity="0.8"/>
  <circle cx="${W - 24}" cy="19" r="6" fill="#28c840" opacity="0.8"/>

  <!-- ── Main content ── -->

  <!-- Avatar circle placeholder with initials -->
  <circle cx="96" cy="310" r="54" fill="#161b22" stroke="#30363d" stroke-width="2"/>
  <text x="96" y="322" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="28" font-weight="700" fill="#58a6ff">DPS</text>

  <!-- Name -->
  <text x="180" y="276" font-family="ui-sans-serif,sans-serif" font-size="52" font-weight="800" fill="#e6edf3" letter-spacing="-1">Devendra Pratap Singh</text>

  <!-- Handle -->
  <text x="182" y="316" font-family="ui-monospace,monospace" font-size="22" fill="#58a6ff">@0xdps</text>

  <!-- Role -->
  <text x="182" y="352" font-family="ui-sans-serif,sans-serif" font-size="22" fill="#7d8590">Principal Software Engineer · System Architect</text>

  <!-- Divider -->
  <line x1="180" y1="376" x2="1100" y2="376" stroke="#30363d" stroke-width="1"/>

  <!-- Stats row -->
  <!-- 10+ Years -->
  <text x="212" y="428" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="36" font-weight="800" fill="#58a6ff">10+</text>
  <text x="212" y="454" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="14" fill="#484f58" letter-spacing="1">YEARS EXP.</text>

  <line x1="330" y1="406" x2="330" y2="460" stroke="#30363d" stroke-width="1"/>

  <!-- 5 Industries -->
  <text x="412" y="428" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="36" font-weight="800" fill="#58a6ff">5</text>
  <text x="412" y="454" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="14" fill="#484f58" letter-spacing="1">INDUSTRIES</text>

  <line x1="530" y1="406" x2="530" y2="460" stroke="#30363d" stroke-width="1"/>

  <!-- 10M+ Users -->
  <text x="636" y="428" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="36" font-weight="800" fill="#58a6ff">10M+</text>
  <text x="636" y="454" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="14" fill="#484f58" letter-spacing="1">USERS REACHED</text>

  <line x1="766" y1="406" x2="766" y2="460" stroke="#30363d" stroke-width="1"/>

  <!-- Currently @ Spinny -->
  <text x="906" y="428" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="20" font-weight="700" fill="#e6edf3">@ Spinny</text>
  <circle cx="800" cy="435" r="5" fill="#28c840"/>
  <text x="814" y="439" font-family="ui-sans-serif,sans-serif" font-size="14" fill="#7d8590">Currently</text>
  <text x="906" y="454" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="13" fill="#484f58">Principal Engineer</text>

  <!-- Divider -->
  <line x1="180" y1="480" x2="1100" y2="480" stroke="#30363d" stroke-width="1"/>

  <!-- Tech tags row -->
  ${[
    'Python', 'Node.js', 'Golang', 'Java', 'PostgreSQL',
    'Kafka', 'Kubernetes', 'GCP', 'AWS', 'System Design'
  ].map((tag, i) => {
    const x = 180 + i * 97;
    return `
    <rect x="${x}" y="496" width="${tag.length * 7.4 + 16}" height="24" rx="4" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <text x="${x + (tag.length * 7.4 + 16) / 2}" y="512" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#7d8590">${tag}</text>
    `;
  }).join('')}

  <!-- Bottom domain -->
  <text x="${W - 32}" y="${H - 20}" text-anchor="end" font-family="ui-monospace,monospace" font-size="16" fill="#30363d">dps.codes</text>
</svg>
`.trim();

try {
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);
  console.log(`✅  OG banner generated → ${outPath}`);
} catch (err) {
  console.error('❌  Failed to generate OG banner:', err.message);
  process.exit(1);
}

// يولد PNG icons من SVG باستخدام sharp
// تشغيل: node scripts/generate-icons.js
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// SVG source
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#4f46e5"/>
  <rect x="80" y="160" width="352" height="240" rx="20" fill="white" opacity="0.15"/>
  <text x="256" y="300" font-size="200" text-anchor="middle" font-family="serif" fill="white">🎓</text>
  <text x="256" y="420" font-size="60" text-anchor="middle" font-family="Arial" font-weight="bold" fill="white">EduFlow</text>
</svg>`;

try {
  const sharp = require('sharp');
  const buf = Buffer.from(svg);
  Promise.all(
    sizes.map(s =>
      sharp(buf).resize(s, s).png().toFile(path.join(iconsDir, `icon-${s}.png`))
        .then(() => console.log(`✅ icon-${s}.png`))
    )
  ).then(() => console.log('Done!'));
} catch {
  // sharp غير مثبت — نسخ SVG كـ fallback
  console.log('sharp not found — copying SVG as fallback');
  sizes.forEach(s => {
    fs.copyFileSync(path.join(iconsDir, 'icon.svg'), path.join(iconsDir, `icon-${s}.png`));
  });
}

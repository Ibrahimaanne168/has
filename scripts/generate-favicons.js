const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'public', 'images', 'logo-has.jpg');

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type (1 = icon)
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // offset in file
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(p => p.buffer)
  ]);
}

async function run() {
  console.log('Generating favicons and icons from logo-has.jpg...');

  const sizes = [16, 32, 48, 96, 180, 192, 512];
  const buffers = {};

  for (const s of sizes) {
    buffers[s] = await sharp(srcPath)
      .resize(s, s, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
  }

  // Create multi-res ICO (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buffers[16] },
    { width: 32, height: 32, buffer: buffers[32] },
    { width: 48, height: 48, buffer: buffers[48] },
  ]);

  // Write files
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'src', 'app');

  // Next.js App Router icons
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'icon.png'), buffers[32]);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), buffers[180]);

  // Public files for static links and search engines
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), buffers[16]);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buffers[32]);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), buffers[48]);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buffers[180]);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), buffers[192]);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), buffers[512]);

  // Web manifest
  const manifest = {
    name: "Halil Académie Scientifique (HAS)",
    short_name: "HAS",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#0f2744",
    background_color: "#ffffff",
    display: "standalone"
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('All favicons, icons and manifest generated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

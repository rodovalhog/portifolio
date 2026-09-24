import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateBitmapData(width, height) {
  const dibHeaderSize = 40;
  const xorSize = width * height * 4;
  const andRowSize = Math.floor((width + 31) / 32) * 4;
  const andSize = andRowSize * height;
  const totalImageSize = dibHeaderSize + xorSize + andSize;

  const buf = Buffer.alloc(totalImageSize);

  // BITMAPINFOHEADER
  buf.writeUInt32LE(40, 0); // header size
  buf.writeInt32LE(width, 4);
  buf.writeInt32LE(height * 2, 8); // doubled height for ICO mask format
  buf.writeUInt16LE(1, 12); // planes
  buf.writeUInt16LE(32, 14); // 32 bpp
  buf.writeUInt32LE(0, 16); // BI_RGB (uncompressed)
  buf.writeUInt32LE(xorSize + andSize, 20); // image size
  buf.writeInt32LE(0, 24);
  buf.writeInt32LE(0, 28);
  buf.writeUInt32LE(0, 32);
  buf.writeUInt32LE(0, 36);

  let offset = 40;

  // Render pixels (bottom-up in BMP format)
  // y=0 is bottom, y=height-1 is top
  const cornerRadius = width >= 32 ? 6 : 3;

  for (let y = 0; y < height; y++) {
    const py = height - 1 - y; // top-down coordinate
    for (let x = 0; x < width; x++) {
      let r = 9, g = 9, b = 11, a = 255; // Dark background #09090b

      // Corner radius rounding check
      let inCorner = false;
      if (x < cornerRadius && py < cornerRadius) {
        if ((x - cornerRadius) ** 2 + (py - cornerRadius) ** 2 > cornerRadius ** 2) inCorner = true;
      } else if (x >= width - cornerRadius && py < cornerRadius) {
        if ((x - (width - 1 - cornerRadius)) ** 2 + (py - cornerRadius) ** 2 > cornerRadius ** 2) inCorner = true;
      } else if (x < cornerRadius && py >= height - cornerRadius) {
        if ((x - cornerRadius) ** 2 + (py - (height - 1 - cornerRadius)) ** 2 > cornerRadius ** 2) inCorner = true;
      } else if (x >= width - cornerRadius && py >= height - cornerRadius) {
        if ((x - (width - 1 - cornerRadius)) ** 2 + (py - (height - 1 - cornerRadius)) ** 2 > cornerRadius ** 2) inCorner = true;
      }

      if (inCorner) {
        r = 0; g = 0; b = 0; a = 0;
      } else {
        // Border outline #27272a
        if (x === 0 || x === width - 1 || py === 0 || py === height - 1) {
          r = 39; g = 39; b = 42;
        }

        if (width >= 32) {
          // Terminal prompt ">" : lines (8,9)->(14,15) and (14,15)->(8,21)
          let isPrompt = false;
          for (let t = 0; t <= 1; t += 0.05) {
            const px1 = 8 + t * 6;
            const py1 = 9 + t * 6;
            if (Math.hypot(x - px1, py - py1) < 1.4) {
              isPrompt = true;
              break;
            }
            const px2 = 14 - t * 6;
            const py2 = 15 + t * 6;
            if (Math.hypot(x - px2, py - py2) < 1.4) {
              isPrompt = true;
              break;
            }
          }

          if (isPrompt) {
            r = 52; g = 211; b = 153; // #34d399 (emerald-400)
          }

          // Cursor "_" from x=16 to 23, py=21 to 22
          if (x >= 16 && x <= 23 && (py === 21 || py === 22)) {
            r = 250; g = 250; b = 250; // #fafafa
          }
        } else {
          // 16x16 icon optimized rendering
          // Prompt ">": (4,4)->(7,7)->(4,10)
          let isPrompt = false;
          if ((x === 4 && (py === 4 || py === 10)) ||
              (x === 5 && (py === 5 || py === 9)) ||
              (x === 6 && (py === 6 || py === 8)) ||
              (x === 7 && py === 7)) {
            isPrompt = true;
          }

          if (isPrompt) {
            r = 52; g = 211; b = 153; // #34d399
          }

          // Cursor "_" from x=8 to 12, py=10
          if (x >= 8 && x <= 12 && py === 10) {
            r = 250; g = 250; b = 250;
          }
        }
      }

      // BGRA
      buf.writeUInt8(b, offset);
      buf.writeUInt8(g, offset + 1);
      buf.writeUInt8(r, offset + 2);
      buf.writeUInt8(a, offset + 3);
      offset += 4;
    }
  }

  // AND mask (0 for opaque/handled by alpha)
  for (let i = 0; i < andSize; i++) {
    buf.writeUInt8(0, offset + i);
  }

  return { buf, size: totalImageSize, width, height };
}

function buildIcoFile(images) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalEntriesSize = dirEntrySize * images.length;
  let currentOffset = headerSize + totalEntriesSize;

  const entriesBuf = Buffer.alloc(totalEntriesSize);

  images.forEach((img, i) => {
    const entryOffset = i * dirEntrySize;
    entriesBuf.writeUInt8(img.width === 256 ? 0 : img.width, entryOffset);
    entriesBuf.writeUInt8(img.height === 256 ? 0 : img.height, entryOffset + 1);
    entriesBuf.writeUInt8(0, entryOffset + 2); // color palette
    entriesBuf.writeUInt8(0, entryOffset + 3); // reserved
    entriesBuf.writeUInt16LE(1, entryOffset + 4); // color planes
    entriesBuf.writeUInt16LE(32, entryOffset + 6); // bpp
    entriesBuf.writeUInt32LE(img.size, entryOffset + 8); // image size
    entriesBuf.writeUInt32LE(currentOffset, entryOffset + 12); // offset in file
    currentOffset += img.size;
  });

  const headerBuf = Buffer.alloc(headerSize);
  headerBuf.writeUInt16LE(0, 0); // reserved
  headerBuf.writeUInt16LE(1, 2); // ICO format
  headerBuf.writeUInt16LE(images.length, 4); // number of images

  return Buffer.concat([headerBuf, entriesBuf, ...images.map((img) => img.buf)]);
}

const img32 = generateBitmapData(32, 32);
const img16 = generateBitmapData(16, 16);
const icoBuffer = buildIcoFile([img32, img16]);

const publicDir = path.resolve(__dirname, "../apps/web/public");

fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);

console.log(`Generated dual-resolution favicon.ico (${icoBuffer.length} bytes) in public/`);


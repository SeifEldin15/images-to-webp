import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedExtensions = [".jpg", ".jpeg", ".png"];

// Get folder path from command-line argument
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("❌ Please provide a directory path as an argument.");
  process.exit(1);
}

function walkAndConvert(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkAndConvert(fullPath); // Recursively walk subdirectories
    } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
      const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

      sharp(fullPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✅ Converted: ${fullPath} → ${outputPath}`);
        })
        .catch((err) => {
          console.error(`❌ Error converting ${fullPath}:`, err.message);
        });
    }
  });
}

walkAndConvert(path.resolve(inputPath));

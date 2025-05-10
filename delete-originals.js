import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedExtensions = ['.jpg', '.jpeg', '.png'];

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("❌ Please provide a directory path as an argument.");
  process.exit(1);
}

function walkAndDelete(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkAndDelete(fullPath);
    } else if (
      stat.isFile() &&
      supportedExtensions.includes(path.extname(file).toLowerCase())
    ) {
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Deleted: ${fullPath}`);
    }
  });
}

walkAndDelete(path.resolve(inputPath));

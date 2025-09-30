#!/usr/bin/env node

import fs from "fs";
import path from "path";
import sharp from "sharp";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedExtensions = [".jpg", ".jpeg", ".png"];

console.log("🖼️  Welcome to Images to WebP Converter!");
console.log("═══════════════════════════════════════");

async function validateDirectory(dirPath) {
  try {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) {
      return "Path is not a directory";
    }
    return true;
  } catch (error) {
    return "Directory does not exist or is not accessible";
  }
}

async function countImages(dir) {
  let count = 0;
  
  function walkDir(directory) {
    try {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          count++;
        }
      });
    } catch (error) {
      // Skip directories we can't access
    }
  }
  
  walkDir(dir);
  return count;
}

async function convertImages(dir, quality = 80) {
  let converted = 0;
  let errors = 0;

  async function walkAndConvert(directory) {
    try {
      const files = fs.readdirSync(directory);
      
      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await walkAndConvert(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
          
          try {
            await sharp(fullPath)
              .webp({ quality })
              .toFile(outputPath);
            
            console.log(`✅ Converted: ${path.relative(process.cwd(), fullPath)} → ${path.basename(outputPath)}`);
            converted++;
          } catch (err) {
            console.error(`❌ Error converting ${fullPath}:`, err.message);
            errors++;
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error accessing directory ${directory}:`, error.message);
    }
  }

  await walkAndConvert(dir);
  return { converted, errors };
}

async function deleteOriginals(dir) {
  let deleted = 0;

  function walkAndDelete(directory) {
    try {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkAndDelete(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          // Check if corresponding .webp file exists
          const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
          if (fs.existsSync(webpPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️  Deleted: ${path.relative(process.cwd(), fullPath)}`);
            deleted++;
          } else {
            console.log(`⚠️  Skipped: ${path.relative(process.cwd(), fullPath)} (no WebP version found)`);
          }
        }
      });
    } catch (error) {
      console.error(`❌ Error accessing directory ${directory}:`, error.message);
    }
  }

  walkAndDelete(dir);
  return deleted;
}

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "directory",
        message: "📁 Enter the directory path containing images:",
        default: "./",
        validate: validateDirectory
      },
      {
        type: "list",
        name: "quality",
        message: "🎨 Choose WebP quality:",
        choices: [
          { name: "High Quality (90)", value: 90 },
          { name: "Standard Quality (80)", value: 80 },
          { name: "Good Quality (70)", value: 70 },
          { name: "Smaller Size (60)", value: 60 }
        ],
        default: 80
      }
    ]);

    const resolvedPath = path.resolve(answers.directory);
    const imageCount = await countImages(resolvedPath);
    
    if (imageCount === 0) {
      console.log("📝 No supported images found (.jpg, .jpeg, .png)");
      return;
    }

    console.log(`\n📊 Found ${imageCount} image(s) to convert`);
    
    const confirmConvert = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: `Convert ${imageCount} image(s) to WebP format?`,
        default: true
      }
    ]);

    if (!confirmConvert.proceed) {
      console.log("👋 Operation cancelled");
      return;
    }

    console.log("\n🔄 Converting images...");
    const { converted, errors } = await convertImages(resolvedPath, answers.quality);
    
    console.log(`\n📈 Conversion complete!`);
    console.log(`✅ Successfully converted: ${converted} images`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} images`);
    }

    if (converted > 0) {
      const deleteConfirm = await inquirer.prompt([
        {
          type: "confirm",
          name: "deleteOriginals",
          message: "🗑️  Delete original files after successful conversion?",
          default: false
        }
      ]);

      if (deleteConfirm.deleteOriginals) {
        console.log("\n🗑️  Deleting original files...");
        const deleted = await deleteOriginals(resolvedPath);
        console.log(`✅ Deleted ${deleted} original files`);
      }
    }

    console.log("\n🎉 All done! Your images have been optimized.");
    
  } catch (error) {
    console.error("❌ An error occurred:", error.message);
    process.exit(1);
  }
}

main();
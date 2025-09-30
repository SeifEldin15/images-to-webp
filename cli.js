#!/usr/bin/env node

import fs from "fs";
import path from "path";
import sharp from "sharp";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedExtensions = [".jpg", ".jpeg", ".png"];
const codeFileExtensions = [".html", ".css", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".php", ".md"];

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

async function findCodeFiles(dir) {
  const codeFiles = [];
  
  function walkDir(directory) {
    try {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip common directories that don't contain source code
          const dirName = path.basename(fullPath);
          if (!['node_modules', '.git', 'dist', 'build', '.next', 'vendor'].includes(dirName)) {
            walkDir(fullPath);
          }
        } else if (stat.isFile() && codeFileExtensions.includes(path.extname(file).toLowerCase())) {
          codeFiles.push(fullPath);
        }
      });
    } catch (error) {
      // Skip directories we can't access
    }
  }
  
  walkDir(dir);
  return codeFiles;
}

async function previewCodeChanges(dir, convertedImages) {
  const codeFiles = await findCodeFiles(dir);
  const changes = [];

  for (const filePath of codeFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileChanges = [];

      // Create safe patterns for each converted image
      for (const imagePath of convertedImages) {
        const imageFilename = path.basename(imagePath);
        const escapedFilename = imageFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Ultra-safe pattern: only match exact filename with image extensions
        const safePattern = new RegExp(escapedFilename, 'g');
        
        let match;
        while ((match = safePattern.exec(content)) !== null) {
          // Double-check it's actually an image reference
          if (/\.(jpg|jpeg|png)$/i.test(match[0])) {
            const webpVersion = match[0].replace(/\.(jpg|jpeg|png)$/i, '.webp');
            fileChanges.push({
              line: content.substring(0, match.index).split('\n').length,
              from: match[0],
              to: webpVersion
            });
          }
        }
      }

      if (fileChanges.length > 0) {
        changes.push({
          file: path.relative(process.cwd(), filePath),
          changes: fileChanges
        });
      }

    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
    }
  }

  return changes;
}

async function updateCodeFiles(dir, convertedImages) {
  const codeFiles = await findCodeFiles(dir);
  let updatedFiles = 0;
  let totalReplacements = 0;

  for (const filePath of codeFiles) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let replacements = 0;

      // Create ultra-safe patterns for each converted image
      for (const imagePath of convertedImages) {
        const imageFilename = path.basename(imagePath);
        const escapedFilename = imageFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Ultra-safe: Only replace exact filename matches with image extensions
        const safePattern = new RegExp(escapedFilename, 'g');
        
        content = content.replace(safePattern, (match) => {
          // Triple-check: only replace if it's actually an image file
          if (/\.(jpg|jpeg|png)$/i.test(match)) {
            replacements++;
            return match.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          }
          return match;
        });
      }

      if (content !== originalContent && replacements > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`📝 Updated: ${path.relative(process.cwd(), filePath)} (${replacements} references)`);
        updatedFiles++;
        totalReplacements += replacements;
      }

    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, error.message);
    }
  }

  return { updatedFiles, totalReplacements };
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
    
    // Keep track of converted images for code updates
    const convertedImages = [];
    const originalConvertImages = convertImages;
    
    // Collect converted image paths
    const { converted, errors } = await (async function(dir, quality) {
      let convertedCount = 0;
      let errorCount = 0;

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
                convertedImages.push(fullPath); // Track converted images
                convertedCount++;
              } catch (err) {
                console.error(`❌ Error converting ${fullPath}:`, err.message);
                errorCount++;
              }
            }
          }
        } catch (error) {
          console.error(`❌ Error accessing directory ${directory}:`, error.message);
        }
      }

      await walkAndConvert(dir);
      return { converted: convertedCount, errors: errorCount };
    })(resolvedPath, answers.quality);
    
    console.log(`\n📈 Conversion complete!`);
    console.log(`✅ Successfully converted: ${converted} images`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} images`);
    }

    if (converted > 0) {
      // Ask about updating code files
      const updateCodeConfirm = await inquirer.prompt([
        {
          type: "confirm",
          name: "updateCode",
          message: "📝 Update code files to use new WebP images? (Only changes file extensions safely)",
          default: true
        }
      ]);

      if (updateCodeConfirm.updateCode) {
        console.log("\n📝 Scanning code files for image references...");
        console.log("🔒 Safe mode: Only updating file extensions (.jpg/.png → .webp)");
        
        // Preview changes first
        const preview = await previewCodeChanges(resolvedPath, convertedImages);
        
        if (preview.length > 0) {
          console.log(`\n👁️  Preview of changes (${preview.length} files):`);
          preview.forEach(({ file, changes }) => {
            console.log(`📄 ${file}:`);
            changes.forEach(({ line, from, to }) => {
              console.log(`   Line ${line}: "${from}" → "${to}"`);
            });
          });
          
          const confirmChanges = await inquirer.prompt([
            {
              type: "confirm",
              name: "proceed",
              message: "Apply these changes to your code files?",
              default: true
            }
          ]);
          
          if (confirmChanges.proceed) {
            const { updatedFiles, totalReplacements } = await updateCodeFiles(resolvedPath, convertedImages);
            console.log(`✅ Updated ${updatedFiles} code file(s) with ${totalReplacements} image reference(s)`);
            console.log("💡 All paths and contexts preserved - only extensions changed");
          } else {
            console.log("⏭️  Skipped code updates");
          }
        } else {
          console.log("📝 No code files found that reference the converted images");
        }
      }

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
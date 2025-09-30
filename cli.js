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
    const resolvedPath = path.resolve(dirPath);
    const stat = fs.statSync(resolvedPath);
    if (!stat.isDirectory()) {
      return "Path is not a directory";
    }
    return true;
  } catch (error) {
    return "Directory does not exist or is not accessible";
  }
}

async function countImages(dir, exclusionPatterns = []) {
  let count = 0;
  
  function walkDir(directory) {
    try {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          const relativePath = path.relative(dir, fullPath);
          if (!shouldExcludeImage(relativePath, exclusionPatterns)) {
            count++;
          }
        }
      });
    } catch (error) {
    }
  }
  
  walkDir(dir);
  return count;
}

async function convertImages(dir, quality = 80, exclusionPatterns = []) {
  let converted = 0;
  let errors = 0;
  let skipped = 0;

  async function walkAndConvert(directory) {
    try {
      const files = fs.readdirSync(directory);
      
      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await walkAndConvert(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          const relativePath = path.relative(dir, fullPath);
          
          if (shouldExcludeImage(relativePath, exclusionPatterns)) {
            console.log(`⏭️  Skipped: ${path.relative(process.cwd(), fullPath)} (excluded)`);
            skipped++;
            continue;
          }
          
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
  return { converted, errors, skipped };
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
          const dirName = path.basename(fullPath);
          if (!['node_modules', '.git', 'dist', 'build', '.next', 'vendor'].includes(dirName)) {
            walkDir(fullPath);
          }
        } else if (stat.isFile() && codeFileExtensions.includes(path.extname(file).toLowerCase())) {
          codeFiles.push(fullPath);
        }
      });
    } catch (error) {
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

      for (const imagePath of convertedImages) {
        const imageFilename = path.basename(imagePath);
        const escapedFilename = imageFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const safePattern = new RegExp(escapedFilename, 'g');
        
        let match;
        while ((match = safePattern.exec(content)) !== null) {
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

      for (const imagePath of convertedImages) {
        const imageFilename = path.basename(imagePath);
        const escapedFilename = imageFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const safePattern = new RegExp(escapedFilename, 'g');
        
        content = content.replace(safePattern, (match) => {
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

async function collectAllImages(dir) {
  const images = [];
  
  function walkDir(directory) {
    try {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
          images.push({
            fullPath,
            relativePath: path.relative(dir, fullPath),
            filename: path.basename(fullPath)
          });
        }
      });
    } catch (error) {
    }
  }
  
  walkDir(dir);
  return images;
}

function shouldExcludeImage(imagePath, exclusionPatterns) {
  if (!exclusionPatterns || exclusionPatterns.length === 0) {
    return false;
  }
  
  const filename = path.basename(imagePath);
  const relativePath = imagePath;
  
  return exclusionPatterns.some(pattern => {
    // Direct filename match
    if (pattern === filename) {
      return true;
    }
    
    // Wildcard pattern matching
    if (pattern.includes('*')) {
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`, 'i');
      return regex.test(filename) || regex.test(relativePath);
    }
    
    // Partial filename match
    return filename.toLowerCase().includes(pattern.toLowerCase()) ||
           relativePath.toLowerCase().includes(pattern.toLowerCase());
  });
}

async function detectCommonImageDirs() {
  const commonDirs = ['public', 'assets', 'images', 'img', 'static', 'src/assets', 'public/images'];
  const existingDirs = [];
  
  for (const dir of commonDirs) {
    const fullPath = path.join(process.cwd(), dir);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const imageCount = await countImages(fullPath);
        if (imageCount > 0) {
          existingDirs.push({ dir, path: fullPath, count: imageCount });
        }
      }
    } catch (error) {
    }
  }
  
  return existingDirs;
}

async function main() {
  try {
    const commonImageDirs = await detectCommonImageDirs();
    const currentDirImages = await countImages(process.cwd());
    
    const choices = [];
    
    choices.push({
      name: `🏠 Current directory (${currentDirImages} images found)`, 
      value: "current"
    });
    
    commonImageDirs.forEach(({ dir, count }) => {
      choices.push({
        name: `📁 ./${dir}/ (${count} images found)`,
        value: dir
      });
    });
    
    choices.push({ 
      name: "📂 Specify a different path", 
      value: "custom" 
    });

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "directoryChoice",
        message: "📁 Where are your images located?",
        choices: choices,
        default: "current"
      },
      {
        type: "input",
        name: "directory",
        message: "📁 Enter the directory path containing images:",
        default: "./",
        validate: validateDirectory,
        when: (answers) => answers.directoryChoice === "custom"
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

    let workingDirectory;
    if (answers.directoryChoice === "current") {
      workingDirectory = process.cwd();
    } else if (answers.directoryChoice === "custom") {
      workingDirectory = answers.directory;
    } else {
      workingDirectory = path.join(process.cwd(), answers.directoryChoice);
    }
    
    const resolvedPath = path.resolve(workingDirectory);
    
    if (answers.directoryChoice === "current") {
      console.log(`\n🏠 Using current directory: ${path.basename(resolvedPath)}`);
    } else if (answers.directoryChoice === "custom") {
      console.log(`\n📂 Using specified directory: ${resolvedPath}`);
    } else {
      console.log(`\n📁 Using detected directory: ./${answers.directoryChoice}/`);
    }
    
    const imageCount = await countImages(resolvedPath);
    
    if (imageCount === 0) {
      console.log("\n❌ No images found in selected directory!");
      console.log(`📝 No supported images (.jpg, .jpeg, .png) found in: ${resolvedPath}`);
      console.log("\n💡 Please:");
      console.log("   • Check the directory path");
      console.log("   • Make sure images have supported extensions (.jpg, .jpeg, .png)");
      console.log("   • Try running the command again with a different directory");
      process.exit(1);
    }

    console.log(`\n📊 Found ${imageCount} image(s) to convert`);
    
    // Handle exclusions
    let exclusionPatterns = [];
    const exclusionChoice = await inquirer.prompt([
      {
        type: "list",
        name: "exclusionType",
        message: "🚫 Do you want to exclude any images?",
        choices: [
          { name: "No, convert all images", value: "none" },
          { name: "Yes, exclude by filename patterns", value: "patterns" },
          { name: "Yes, let me select specific images to exclude", value: "select" }
        ],
        default: "none"
      }
    ]);

    if (exclusionChoice.exclusionType === "patterns") {
      const patternInput = await inquirer.prompt([
        {
          type: "input",
          name: "patterns",
          message: "🎯 Enter exclusion patterns (comma-separated):\n     Examples: logo.png, *thumbnail*, temp*, *.backup.jpg",
          validate: (input) => {
            if (!input || input.trim() === "") {
              return "Please enter at least one pattern or choose 'No exclusions'";
            }
            return true;
          }
        }
      ]);
      
      exclusionPatterns = patternInput.patterns
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);
        
      console.log(`🎯 Exclusion patterns: ${exclusionPatterns.join(', ')}`);
      
    } else if (exclusionChoice.exclusionType === "select") {
      const allImages = await collectAllImages(resolvedPath);
      
      if (allImages.length === 0) {
        console.log("❌ No images found for selection!");
        process.exit(1);
      }
      
      const imageChoices = allImages.map(img => ({
        name: `${img.relativePath} (${(fs.statSync(img.fullPath).size / 1024).toFixed(1)}KB)`,
        value: img.relativePath
      }));
      
      const exclusionSelection = await inquirer.prompt([
        {
          type: "checkbox",
          name: "excludedImages",
          message: "📋 Select images to EXCLUDE from conversion:",
          choices: imageChoices,
          pageSize: 15
        }
      ]);
      
      exclusionPatterns = exclusionSelection.excludedImages;
      
      if (exclusionPatterns.length > 0) {
        console.log(`🚫 Will exclude ${exclusionPatterns.length} image(s)`);
      }
    }

    // Recalculate image count with exclusions
    const finalImageCount = await countImages(resolvedPath, exclusionPatterns);
    
    if (finalImageCount === 0) {
      console.log("\n❌ No images remain after applying exclusions!");
      console.log("💡 Try adjusting your exclusion patterns or selecting fewer images to exclude");
      process.exit(1);
    }
    
    if (exclusionPatterns.length > 0) {
      console.log(`\n📊 After exclusions: ${finalImageCount} image(s) will be converted`);
    }
    
    const confirmConvert = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: `Convert ${finalImageCount} image(s) to WebP format?`,
        default: true
      }
    ]);

    if (!confirmConvert.proceed) {
      console.log("👋 Operation cancelled");
      return;
    }

    console.log("\n🔄 Converting images...");
    
    const convertedImages = [];
    
    const { converted, errors, skipped } = await (async function(dir, quality, exclusionPatterns) {
      let convertedCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      async function walkAndConvert(directory) {
        try {
          const files = fs.readdirSync(directory);
          
          for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              await walkAndConvert(fullPath);
            } else if (stat.isFile() && supportedExtensions.includes(path.extname(file).toLowerCase())) {
              const relativePath = path.relative(dir, fullPath);
              
              if (shouldExcludeImage(relativePath, exclusionPatterns)) {
                console.log(`⏭️  Skipped: ${path.relative(process.cwd(), fullPath)} (excluded)`);
                skippedCount++;
                continue;
              }
              
              const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
              
              try {
                await sharp(fullPath)
                  .webp({ quality })
                  .toFile(outputPath);
                
                console.log(`✅ Converted: ${path.relative(process.cwd(), fullPath)} → ${path.basename(outputPath)}`);
                convertedImages.push(fullPath);
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
      return { converted: convertedCount, errors: errorCount, skipped: skippedCount };
    })(resolvedPath, answers.quality, exclusionPatterns);
    
    console.log(`\n📈 Conversion complete!`);
    console.log(`✅ Successfully converted: ${converted} images`);
    if (skipped > 0) {
      console.log(`⏭️  Excluded: ${skipped} images`);
    }
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} images`);
    }

    if (converted > 0) {
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
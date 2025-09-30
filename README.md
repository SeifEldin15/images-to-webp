# 🖼️ Images to WebP Converter

**Transform your images to WebP format with zero configuration!** ⚡

An interactive CLI tool that automatically converts JPG, JPEG, and PNG images to WebP format. Includes smart directory detection, safe code updates, and opt## 📈 Changelog

### v1.0.1 (Latest)
- 🔧 Fixed installation conflicts with clean command names
- ✅ Easy installation without --force flag required
- 📝 Added shorter command alias: `webp-converter`
- 🛠️ Improved npm package stability

### v1.0.0
- 🚀 Initial npm release
- ✨ Enhanced smart directory detection
- 🔍 Preview code changes before applying  
- 🔒 Ultra-safe code updates (extensions only)
- 📊 Improved progress tracking and error handling
- 🎨 Interactive CLI interfaceup of original files.

[![npm version](https://badge.fury.io/js/webp-image-converter.svg)](https://www.npmjs.com/package/webp-image-converter)
[![Cross-Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://www.npmjs.com/package/webp-image-converter)

## ⚡ Quick Start

### Just run this command in your project directory:

```bash
npx webp-image-converter
```

**That's it!** No installation needed. The tool will:
- 🔍 Scan for images in your current directory and common folders
- 🎨 Let you choose quality settings
- 🔄 Convert all images to WebP format
- 📝 Update your code files to use the new WebP images
- 🗑️ Optionally clean up original files

### Alternative Installation Methods:

```bash
# Install globally (if you use it frequently)
npm install -g webp-image-converter
webp-converter

# Or install from GitHub
npx github:SeifEldin15/webp-image-converter
```

---

## ✨ Why Use This Tool?

- **🚀 Zero Configuration** - Just run `npx webp-image-converter` and follow prompts
- **🏠 Smart Detection** - Automatically finds images in common folders (`public/`, `assets/`, `images/`, etc.)
- **📱 Cross-Platform** - Works on Windows, macOS, and Linux
- **🎨 Quality Control** - Choose from 4 quality presets (60-90%)
- **📝 Code Updates** - Safely updates HTML, CSS, JS files to use WebP (with preview!)
- **⚡ Fast & Recursive** - Processes all subdirectories automatically
- **🔒 Safe Operations** - Preview changes before applying, confirmation prompts
- **📊 Progress Tracking** - Real-time conversion progress and detailed results

## 🎯 How It Works

1. **🏃‍♂️ Run** - `npx webp-image-converter` in your project directory
2. **📂 Choose** - Current directory, detected folders, or custom path
3. **🎨 Quality** - High (90%), Standard (80%), Good (70%), or Small (60%)
4. **✅ Confirm** - Review how many images will be converted
5. **⚡ Convert** - Watch real-time progress as images are optimized
6. **📝 Update** - Preview and apply code changes (HTML/CSS/JS files)
7. **🗑️ Cleanup** - Optionally delete original files (only after successful conversion)

## 📸 Live Demo

```bash
$ npx webp-image-converter

🖼️  Welcome to Images to WebP Converter!
═══════════════════════════════════════
? 📁 Where are your images located? 
  🏠 Current directory (3 images found)
❯ 📁 ./public/ (12 images found)
  📁 ./assets/ (5 images found)
  📂 Specify a different path

? 🎨 Choose WebP quality: Standard Quality (80)

📁 Using detected directory: ./public/

📊 Found 12 image(s) to convert
? Convert 12 image(s) to WebP format? Yes

🔄 Converting images...
✅ Converted: public/hero.jpg → hero.webp
✅ Converted: public/logo.png → logo.webp
✅ Converted: public/gallery/photo1.jpeg → photo1.webp
...

📈 Conversion complete!
✅ Successfully converted: 12 images

? 📝 Update code files to use new WebP images? Yes

📝 Scanning code files for image references...
🔒 Safe mode: Only updating file extensions (.jpg/.png → .webp)

👁️  Preview of changes (3 files):
📄 src/components/Hero.jsx:
   Line 15: "hero.jpg" → "hero.webp"
📄 styles/main.css:
   Line 42: "logo.png" → "logo.webp"
📄 index.html:
   Line 28: "gallery/photo1.jpeg" → "gallery/photo1.webp"

? Apply these changes to your code files? Yes
✅ Updated 3 code file(s) with 3 image reference(s)
💡 All paths and contexts preserved - only extensions changed

? 🗑️  Delete original files after successful conversion? No

🎉 All done! Your images have been optimized.
```ration!** ⚡

An interactive CLI tool that automatically converts JPG, JPEG, and PNG images to WebP format. Includes smart directory detection, safe code updates, and optional cleanup of original files.

[![npm version](https://badge.fury.io/js/webp-image-converter.svg)](https://www.npmjs.com/package/webp-image-converter)
[![Cross-Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://www.npmjs.com/package/webp-image-converter)

## ⚡ Quick Start

### Just run this command in your project directory:

```bash
npx webp-image-converter
```

**That's it!** No installation needed. The tool will:
- 🔍 Scan for images in your current directory and common folders
- 🎨 Let you choose quality settings
- 🔄 Convert all images to WebP format
- 📝 Update your code files to use the new WebP images
- 🗑️ Optionally clean up original files

### Alternative Installation Methods:

```bash
# Install globally (if you use it frequently)
npm install -g webp-image-converter
webp-converter

# Or install from GitHub
npx github:SeifEldin15/webp-image-converter
```

---

## ✨ Why Use This Tool?

- **🚀 Zero Configuration** - Just run `npx webp-image-converter` and follow prompts
- **🏠 Smart Detection** - Automatically finds images in common folders (`public/`, `assets/`, `images/`, etc.)
- **� Cross-Platform** - Works on Windows, macOS, and Linux
- **🎨 Quality Control** - Choose from 4 quality presets (60-90%)
- **📝 Code Updates** - Safely updates HTML, CSS, JS files to use WebP (with preview!)
- **⚡ Fast & Recursive** - Processes all subdirectories automatically
- **🔒 Safe Operations** - Preview changes before applying, confirmation prompts
- **📊 Progress Tracking** - Real-time conversion progress and detailed results

## 🎯 How It Works

1. **🏃‍♂️ Run** - `npx webp-image-converter` in your project directory
2. **📂 Choose** - Current directory, detected folders, or custom path
3. **🎨 Quality** - High (90%), Standard (80%), Good (70%), or Small (60%)
4. **✅ Confirm** - Review how many images will be converted
5. **⚡ Convert** - Watch real-time progress as images are optimized
6. **📝 Update** - Preview and apply code changes (HTML/CSS/JS files)
7. **🗑️ Cleanup** - Optionally delete original files (only after successful conversion)

## 📸 Example Usage

```bash
$ npx webp-image-converter

🖼️  Welcome to Images to WebP Converter!
═══════════════════════════════════════
? 📁 Where are your images located? 
  🏠 Current directory (3 images found)
❯ 📁 ./public/ (12 images found)
  📁 ./assets/ (5 images found)
  📂 Specify a different path
? 🎨 Choose WebP quality: Standard Quality (80)

📊 Found 15 image(s) to convert
? Convert 15 image(s) to WebP format? Yes

🔄 Converting images...
✅ Converted: photos/IMG_001.jpg → IMG_001.webp
✅ Converted: photos/IMG_002.png → IMG_002.webp
...

📈 Conversion complete!
✅ Successfully converted: 15 images
? � Update code files to use new WebP images? (HTML, CSS, JS, etc.) Yes

📝 Scanning and updating code files...
✅ Updated 8 code file(s) with 23 image reference(s)
? �🗑️  Delete original files after successful conversion? No

🎉 All done! Your images have been optimized.
```

## 💰 Benefits

| Benefit | Description |
|---------|-------------|
| **🗜️ Smaller Files** | WebP reduces image size by 25-50% vs JPG/PNG |
| **⚡ Faster Loading** | Better web performance and user experience |
| **🌐 Modern Format** | Supported by all major browsers (95%+ coverage) |
| **🎛️ Quality Control** | Choose between lossless and lossy compression |
| **🔄 Batch Processing** | Convert hundreds of images in seconds |
| **🛡️ Safe Updates** | Preview code changes before applying |

## � System Requirements

| Requirement | Details |
|-------------|---------|
| **Node.js** | Version 16 or higher |
| **Platforms** | Windows, macOS, Linux |
| **Input Formats** | `.jpg`, `.jpeg`, `.png` |
| **Output Format** | `.webp` |
| **Dependencies** | Automatically installed with npm |

## 🔧 Commands & Options

### Available Commands
```bash
npx webp-image-converter          # Run without installing
webp-image-converter             # After global install
webp-converter                   # Shorter alias
```

### Quality Settings
- **High Quality (90%)** - Best quality, larger files
- **Standard Quality (80%)** - Balanced quality/size (recommended)
- **Good Quality (70%)** - Good quality, smaller files  
- **Smaller Size (60%)** - Smallest files, reduced quality

### Directory Options
- **Current Directory** - Process images in the current folder
- **Auto-detected Folders** - Common image directories (`public/`, `assets/`, etc.)
- **Custom Path** - Specify any directory path

## 🚨 Common Use Cases

- **🌐 Web Development** - Optimize images for websites and web apps
- **📱 Mobile Apps** - Reduce app bundle size with smaller images
- **⚡ Performance Optimization** - Improve page load speeds
- **📦 Asset Pipeline** - Integrate into build processes
- **🔄 Batch Conversion** - Convert large image libraries
- **🎨 Content Creation** - Optimize images for blogs and portfolios

## ❓ FAQ

**Q: Will this break my existing code?**  
A: No! The tool safely updates only file extensions and shows you a preview before making changes.

**Q: What if I don't want to update my code files?**  
A: Just say "No" when prompted. The tool will only convert images.

**Q: Can I undo the changes?**  
A: The tool creates WebP versions alongside originals. Only delete originals if you're sure.

**Q: Does this work with Git repositories?**  
A: Yes! The tool respects `.gitignore` and works great in version-controlled projects.

**Q: What's the difference between the commands?**  
A: `webp-image-converter` and `webp-converter` do exactly the same thing - use whichever you prefer!

## 🤝 Contributing

Found a bug or have a feature request? 

- 🐛 [Report Issues](https://github.com/SeifEldin15/webp-image-converter/issues)
- 💡 [Request Features](https://github.com/SeifEldin15/webp-image-converter/issues/new)
- 🔧 [Submit Pull Requests](https://github.com/SeifEldin15/webp-image-converter/pulls)

## � Changelog

### v1.1.0 (Latest)
- ✨ Enhanced smart directory detection
- 🔍 Preview code changes before applying  
- 🔒 Ultra-safe code updates (extensions only)
- 📊 Improved progress tracking and error handling
- 🎨 Better CLI interface and user experience

### v1.0.x
- 🚀 Initial release with basic conversion features

## �📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**⭐ If this tool helped you, please consider starring the repo!**

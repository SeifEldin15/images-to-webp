# 🖼️ Images to WebP Converter

An interactive CLI tool that automatically converts your images to WebP format with optional cleanup of original files. Perfect for web optimization!

## ⚡ Quick Usage

**Option 1: Run without installation (recommended)**
```bash
npx images-to-webp
```

**Option 2: Install globally**
```bash
npm install -g images-to-webp
webp-convert
```

**Option 3: Install from GitHub**
```bash
npx github:SeifEldin15/images-to-webp
```

That's it! The tool will guide you through an interactive setup.

---

## ✨ Features

- 🎯 **Interactive CLI** - No complex commands, just follow the prompts
- 📁 **Recursive conversion** - Processes all subdirectories automatically  
- 🎨 **Quality options** - Choose from High (90), Standard (80), Good (70), or Smaller (60)
- 🔍 **Smart detection** - Finds all `.jpg`, `.jpeg`, and `.png` files
- 📝 **Auto code updates** - Updates HTML, CSS, JS, and other files to use WebP images
- ✅ **Safe cleanup** - Only deletes originals after successful WebP conversion
- 📊 **Progress tracking** - Shows conversion progress and results
- ⚠️ **Confirmation prompts** - Asks before destructive operations

## 🚀 How It Works

1. **Run the command** - `npx images-to-webp`
2. **Choose directory** - Enter the path to your images folder
3. **Select quality** - Pick your preferred WebP quality setting
4. **Review & confirm** - See how many images will be converted
5. **Wait for conversion** - Watch the progress as images are optimized
6. **Update code files** - Automatically update HTML, CSS, JS files to use WebP
7. **Optional cleanup** - Choose whether to delete original files

## 📸 Example Usage

```bash
$ npx images-to-webp

🖼️  Welcome to Images to WebP Converter!
═══════════════════════════════════════
? 📁 Enter the directory path containing images: ./photos
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

## 🎯 Benefits

- **Smaller file sizes** - WebP typically reduces image size by 25-50%
- **Better web performance** - Faster loading times for websites
- **Modern format** - Supported by all major browsers
- **Lossless & lossy** - Choose quality that fits your needs

## 🛠️ Advanced Usage

For developers who want to use the individual scripts:

```bash
# Convert images only
node convert-to-webp.js ./path/to/images

# Delete originals only (after conversion)
node delete-originals.js ./path/to/images
```

## 📋 Requirements

- Node.js 16+ 
- Supports: `.jpg`, `.jpeg`, `.png` files
- Output: `.webp` format

## 🤝 Contributing

Feel free to open issues or submit pull requests on [GitHub](https://github.com/SeifEldin15/images-to-webp)!

## 📄 License

MIT License - see LICENSE file for details.
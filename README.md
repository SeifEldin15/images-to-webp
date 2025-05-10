# 🖼️ Image Tools: Convert to WebP + Clean Originals

This repo contains two Node.js scripts for optimizing images by converting them to `.webp` format and optionally deleting the original `.jpg`, `.jpeg`, or `.png` files.

---

## 📦 Setup

Make sure [Node.js](https://nodejs.org/) is installed.

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
✅ Usage
🔄 Convert images to .webp
bash
Copy
Edit
node convert-to-webp.js <directory>
Example:

bash
Copy
Edit
node convert-to-webp.js ./public/images
This script recursively finds all .jpg, .jpeg, and .png images.

It converts them to .webp using high-efficiency compression.

Originals are kept unless you run the cleanup script below.

🗑️ Delete original .jpg, .jpeg, .png files
bash
Copy
Edit
node delete-originals.js <directory>
Example:

bash
Copy
Edit
node delete-originals.js ./public/images
⚠️ Warning: This will permanently delete .jpg, .jpeg, and .png files in the directory (recursively). Be sure you’ve converted them first.


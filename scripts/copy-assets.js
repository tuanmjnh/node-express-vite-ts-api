// scripts/copy-assets.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../src');
const assetsDir = path.resolve(__dirname, '../assets'); // Example for assets
const distDir = path.resolve(__dirname, '../dist');

fs.mkdirSync(distDir, { recursive: true });

// Copy source code (adjust as per your project structure)
fs.cpSync(sourceDir, path.join(distDir, 'src'), { recursive: true });
console.log('Source code copied.');

// Copy assets (if applicable)
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, path.join(distDir, 'assets'), { recursive: true });
  console.log('Assets copied.');
}
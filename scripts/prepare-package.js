// scripts/prepare-package.js
const fs = require('fs');
const path = require('path');

const originalPackageJsonPath = path.resolve(__dirname, '../package.json');
const distPackageJsonPath = path.resolve(__dirname, '../dist/package.json');

const packageJson = require(originalPackageJsonPath);

// Remove devDependencies
delete packageJson.devDependencies;
// Optionally remove scripts if not needed in the distributed package
delete packageJson.scripts;
packageJson.scripts = {
  "start": "cross-env NODE_ENV=production node src/main.js"
}

fs.mkdirSync(path.dirname(distPackageJsonPath), { recursive: true });
fs.writeFileSync(distPackageJsonPath, JSON.stringify(packageJson, null, 2));
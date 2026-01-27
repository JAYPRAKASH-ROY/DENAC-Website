import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('../headphones sequence');
const targetDir = path.resolve('public/frames');

console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg'));
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    files.forEach((file, index) => {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(targetDir, `frame_${index + 1}.jpg`);
        fs.copyFileSync(srcPath, destPath);
    });

    console.log(`Successfully moved and renamed ${files.length} images to ${targetDir}`);
} else {
    console.error(`Source directory not found: ${sourceDir}`);
}

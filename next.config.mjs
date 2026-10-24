import { execSync } from 'child_process';
import fs from 'fs';

try {
  // Check if the images are missing or incomplete
  if (!fs.existsSync('public/images/images') || fs.readdirSync('public/images/images').length < 1000) {
    console.log("Downloading images...");
    fs.mkdirSync('public/images/images', { recursive: true });
    
    // Download zips
    execSync('curl -sL -o public/images1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    execSync('curl -sL -o public/images2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    
    // Unzip into public/images/images/
    execSync('unzip -q public/images1.zip -d public/images/');
    execSync('unzip -q public/images2.zip -d public/images/');
    
    // Move them one level deeper if the zip created a nested images folder
    if (fs.existsSync('public/images/images')) {
      execSync('mv public/images/images/* public/images/images/ 2>/dev/null || true');
    }

    fs.unlinkSync('public/images1.zip');
    fs.unlinkSync('public/images2.zip');
    console.log("Images ready!");
  }
} catch (e) { console.error("Error downloading images:", e); }

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;

import { execSync } from 'child_process';
import fs from 'fs';

try {
  if (!fs.existsSync('public/images/images') || fs.readdirSync('public/images/images').length < 1000) {
    console.log("Downloading images from GitHub Releases...");
    fs.mkdirSync('public/images/images', { recursive: true });
    
    execSync('curl -sL -o public/img1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    execSync('curl -sL -o public/img2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    
    console.log("Unzipping directly into images/images...");
    execSync('unzip -q public/img1.zip -d public/images/');
    execSync('unzip -q public/img2.zip -d public/images/');
    
    // If the zip made a nested folder, move them up one level
    if (fs.existsSync('public/images/images/images')) {
      execSync('mv public/images/images/images/* public/images/images/ 2>/dev/null || true');
      fs.rmdirSync('public/images/images/images');
    }

    fs.unlinkSync('public/img1.zip');
    fs.unlinkSync('public/img2.zip');
    console.log("Images ready!");
  }
} catch (e) { console.error(e); }

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;

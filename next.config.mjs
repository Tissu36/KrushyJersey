import { execSync } from 'child_process';
import fs from 'fs';

try {
  // If images folder doesn't exist or is missing files, download them
  if (!fs.existsSync('public/images') || fs.readdirSync('public/images').length < 1000) {
    console.log("=== IMAGE DOWNLOAD STARTED ===");
    fs.mkdirSync('public/images', { recursive: true });
    
    // Download zips
    execSync('curl -sL -o public/img1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    execSync('curl -sL -o public/img2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    
    // Unzip them
    console.log("Unzipping...");
    execSync('unzip -q public/img1.zip -d public/');
    execSync('unzip -q public/img2.zip -d public/');
    
    // If the zip extracted to public/images/images, move them up to public/images
    if (fs.existsSync('public/images/images')) {
      console.log("Moving nested images folder up...");
      execSync('mv public/images/images/* public/images/ 2>/dev/null || true');
      fs.rmdirSync('public/images/images');
    }

    // Delete zips to save space
    fs.unlinkSync('public/img1.zip');
    fs.unlinkSync('public/img2.zip');
    
    console.log("=== IMAGE DOWNLOAD FINISHED ===");
    console.log("Total files in public/images:", fs.readdirSync('public/images').length);
  } else {
    console.log("Images already exist. Total:", fs.readdirSync('public/images').length);
  }
} catch (e) { 
  console.error("=== CRITICAL ERROR DOWNLOADING IMAGES ===", e); 
}

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;

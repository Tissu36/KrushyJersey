import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Download and unzip images during Vercel build
try {
  if (!fs.existsSync('public/images') || fs.readdirSync('public/images').length < 1000) {
    console.log("Downloading images from GitHub Releases...");
    fs.mkdirSync('public/images', { recursive: true });
    
    // Download part 1
    execSync('curl -L -o public/images1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    // Download part 2
    execSync('curl -L -o public/images2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    
    // Unzip them (requires unzip command in Vercel build env, which is standard)
    console.log("Unzipping images...");
    execSync('unzip -q public/images1.zip -d public/');
    execSync('unzip -q public/images2.zip -d public/');
    
    // Clean up the zips to save space
    fs.unlinkSync('public/images1.zip');
    fs.unlinkSync('public/images2.zip');
    console.log("Images ready!");
  }
} catch (e) {
  console.error("Error downloading images:", e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true }
};
export default nextConfig;

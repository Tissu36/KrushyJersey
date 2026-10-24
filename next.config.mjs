import { execSync } from 'child_process';
import fs from 'fs';

try {
  if (!fs.existsSync('public/images') || fs.readdirSync('public/images').length < 1000) {
    console.log("Downloading images...");
    fs.mkdirSync('public/images', { recursive: true });
    execSync('curl -sL -o public/images1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    execSync('curl -sL -o public/images2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    execSync('unzip -q public/images1.zip -d public/');
    execSync('unzip -q public/images2.zip -d public/');
    fs.unlinkSync('public/images1.zip');
    fs.unlinkSync('public/images2.zip');
  }
} catch (e) { console.error(e); }

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;

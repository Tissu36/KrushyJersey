import { execSync } from 'child_process';
import fs from 'fs';

try {
  if (!fs.existsSync('public/images') || fs.readdirSync('public/images').length < 1000) {
    fs.mkdirSync('public/images', { recursive: true });
    execSync('curl -sL -o public/img1.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images1.zip');
    execSync('curl -sL -o public/img2.zip https://github.com/Tissu36/KrushyJersey/releases/download/v1.0/images2.zip');
    execSync('unzip -q public/img1.zip -d public/');
    execSync('unzip -q public/img2.zip -d public/');
    if (fs.existsSync('public/images/images')) {
      execSync('mv public/images/images/* public/images/ 2>/dev/null || true');
      fs.rmdirSync('public/images/images');
    }
    fs.unlinkSync('public/img1.zip');
    fs.unlinkSync('public/img2.zip');
  }
} catch (e) { console.error(e); }

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;

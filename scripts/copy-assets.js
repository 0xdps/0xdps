#!/usr/bin/env node

/**
 * Copy static assets to build directory
 * Run before CSS/JS minification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const WEBSITE_DIR = path.join(ROOT_DIR, 'website');
const BUILD_DIR = path.join(ROOT_DIR, 'build');

/**
 * Ensure build directory exists
 */
function ensureBuildDir() {
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }
}

/**
 * Copy static assets
 */
function copyAssets() {
  console.log('📦 Copying static assets...\n');

  // Ensure build directory
  ensureBuildDir();

  // Create assets directory structure
  const buildAssetsDir = path.join(BUILD_DIR, 'assets');
  fs.mkdirSync(buildAssetsDir, { recursive: true });

  // Copy profile images
  const srcProfile = path.join(WEBSITE_DIR, 'assets', 'profile');
  const buildProfile = path.join(buildAssetsDir, 'profile');
  if (fs.existsSync(srcProfile)) {
    fs.cpSync(srcProfile, buildProfile, { recursive: true });
    console.log('✓ Profile images copied');
  }

  // Copy resume
  const srcResume = path.join(WEBSITE_DIR, 'assets', 'resume');
  const buildResume = path.join(buildAssetsDir, 'resume');
  if (fs.existsSync(srcResume)) {
    fs.cpSync(srcResume, buildResume, { recursive: true });
    console.log('✓ Resume copied');
  }

  // Create CSS directory (for minified output)
  const buildCssDir = path.join(buildAssetsDir, 'css');
  fs.mkdirSync(buildCssDir, { recursive: true });

  // Create JS directory (for minified output)
  const buildJsDir = path.join(buildAssetsDir, 'js');
  fs.mkdirSync(buildJsDir, { recursive: true });

  // Copy favicon
  const srcFavicon = path.join(WEBSITE_DIR, 'favicon.svg');
  if (fs.existsSync(srcFavicon)) {
    fs.copyFileSync(srcFavicon, path.join(BUILD_DIR, 'favicon.svg'));
    console.log('✓ Favicon copied');
  }

  // Copy privacy pages
  const srcPrivacy = path.join(WEBSITE_DIR, 'privacy');
  const buildPrivacy = path.join(BUILD_DIR, 'privacy');
  if (fs.existsSync(srcPrivacy)) {
    fs.cpSync(srcPrivacy, buildPrivacy, { recursive: true });
    console.log('✓ Privacy pages copied');
  }

  // Copy robots.txt
  const srcRobots = path.join(WEBSITE_DIR, 'robots.txt');
  if (fs.existsSync(srcRobots)) {
    fs.copyFileSync(srcRobots, path.join(BUILD_DIR, 'robots.txt'));
    console.log('✓ robots.txt copied');
  }

  console.log('\n✅ Static assets copied!\n');
}

// Run
try {
  copyAssets();
} catch (error) {
  console.error('❌ Failed to copy assets:', error.message);
  process.exit(1);
}


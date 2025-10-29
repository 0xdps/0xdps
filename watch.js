#!/usr/bin/env node

/**
 * Watch mode for local development
 * Watches for changes to site-data.json and index.template.html
 * and automatically rebuilds index.html
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const TEMPLATE_FILE = path.join(__dirname, 'index.template.html');

console.log('👀 Starting watch mode for local development...\n');
console.log('Watching:');
console.log(`  - ${DATA_FILE}`);
console.log(`  - ${TEMPLATE_FILE}`);
console.log('\n💡 Press Ctrl+C to stop\n');

// Run initial build
console.log('🔨 Running initial build...\n');
runBuild();

// Watch for file changes
fs.watch(DATA_FILE, (eventType) => {
  if (eventType === 'change') {
    console.log('📝 site-data.json changed - rebuilding...\n');
    runBuild();
  }
});

fs.watch(TEMPLATE_FILE, (eventType) => {
  if (eventType === 'change') {
    console.log('📝 index.template.html changed - rebuilding...\n');
    runBuild();
  }
});

console.log('✅ Watch mode active!\n');
console.log('💻 To serve the site locally, run in another terminal:');
console.log('   npm run serve\n');
console.log('   Then open http://localhost:8000\n');

function runBuild() {
  exec('node build.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Build error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️  Build warning: ${stderr}`);
    }
    console.log(stdout);
  });
}


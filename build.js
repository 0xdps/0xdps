#!/usr/bin/env node

/**
 * Static Site Generator for 0xdps Portfolio
 * Uses Handlebars for templating
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const TEMPLATE_FILE = path.join(__dirname, 'index.template.html');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

/**
 * Register Handlebars helpers
 */
Handlebars.registerHelper('chip', function(text) {
  return new Handlebars.SafeString(`<span class="tech-chip">${text}</span>`);
});

Handlebars.registerHelper('socialIcon', function(iconName) {
  const icons = {
    linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    medium: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
  };
  return new Handlebars.SafeString(icons[iconName] || '');
});

Handlebars.registerHelper('year', function() {
  return new Date().getFullYear();
});

Handlebars.registerHelper('date', function() {
  return new Date().toLocaleDateString();
});

/**
 * Main build function
 */
function build() {
  console.log('🚀 Generating HTML from template...\n');

  // Read site data
  const siteData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  // Read and compile template
  const templateSource = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  const template = Handlebars.compile(templateSource);

  // Generate HTML
  const html = template(siteData);

  // Write output
  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');
  console.log('✅ HTML generated successfully!\n');
  
  // Update sitemap lastmod date
  updateSitemap();
}

// Generate sitemap from template
function updateSitemap() {
  try {
    const SITEMAP_TEMPLATE = './sitemap/sitemap.template.xml';
    const SITEMAP_XSL_TEMPLATE = './sitemap/sitemap.template.xsl';
    const SITEMAP_DEST = './sitemap.xml';
    const SITEMAP_XSL_DEST = './sitemap.xsl';
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    console.log('🗺️ Generating sitemap from template...');
    
    // Read template
    let sitemapTemplate = fs.readFileSync(SITEMAP_TEMPLATE, 'utf-8');
    
    // Replace placeholder with current date
    const sitemap = sitemapTemplate.replace(/{{BUILD_DATE}}/g, currentDate);
    
    // Write generated sitemap to root
    fs.writeFileSync(SITEMAP_DEST, sitemap, 'utf-8');
    
    // Copy XSL stylesheet to root
    const xslContent = fs.readFileSync(SITEMAP_XSL_TEMPLATE, 'utf-8');
    fs.writeFileSync(SITEMAP_XSL_DEST, xslContent, 'utf-8');
    
    console.log(`✅ Sitemap generated with date: ${currentDate}\n`);
  } catch (error) {
    console.warn('⚠️ Failed to generate sitemap:', error.message);
  }
}

// Run build
try {
  build();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

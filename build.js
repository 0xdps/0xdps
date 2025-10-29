#!/usr/bin/env node

/**
 * Static Site Generator for 0xdps Portfolio
 * 
 * This script reads site-data.json and generates a fully pre-rendered index.html
 * No client-side JavaScript is needed for content rendering.
 */

const fs = require('fs');
const path = require('path');

// Paths
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const TEMPLATE_FILE = path.join(__dirname, 'index.template.html');
const OUTPUT_FILE = path.join(__dirname, 'index.html');
const CSS_SOURCE = path.join(__dirname, 'assets', 'css', 'styles.css');
const CSS_OUTPUT = path.join(__dirname, 'assets', 'css', 'styles.min.css');
const JS_SOURCE = path.join(__dirname, 'assets', 'js', 'scripts.js');
const JS_OUTPUT = path.join(__dirname, 'assets', 'js', 'scripts.min.js');

/**
 * Minify CSS
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{};:,>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    .trim();
}

/**
 * Minify JavaScript
 */
function minifyJS(js) {
  return js
    // Remove single-line comments (but preserve URLs)
    .replace(/(?<!:)\/\/[^\n]*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators
    .replace(/\s*([=+\-*/<>!&|,;:{}()\[\]])\s*/g, '$1')
    // Restore space after keywords
    .replace(/\b(if|else|for|while|function|return|var|let|const)\(/g, '$1 (')
    .replace(/\b(if|else|for|while|function|return|var|let|const){/g, '$1 {')
    .trim();
}

/**
 * Minify HTML
 */
function minifyHTML(html) {
  return html
    // Remove HTML comments (except IE conditional comments)
    .replace(/<!--(?!\[if\s)(?!<!)[^\[][\s\S]*?-->/g, '')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove whitespace around text content (but preserve single spaces)
    .replace(/\s{2,}/g, ' ')
    // Remove whitespace after opening tags
    .replace(/(<[^>]+>)\s+/g, '$1')
    // Remove whitespace before closing tags
    .replace(/\s+(<\/[^>]+>)/g, '$1')
    .trim();
}

/**
 * Helper function to create a tech chip HTML
 */
function createChip(text) {
  return `<span class="tech-chip">${text}</span>`;
}

/**
 * Get social icon SVG
 */
function getSocialIcon(iconName) {
  const icons = {
    linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    medium: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
  };
  return icons[iconName] || '';
}

/**
 * Generate social links HTML
 */
function generateSocialLinks(socialLinks) {
  return socialLinks
    .map((link) => {
      const icon = getSocialIcon(link.icon);
      return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}" aria-label="${link.name}" style="text-decoration: none">${icon}</a>`;
    })
    .join('');
}

/**
 * Generate services section HTML
 */
function generateServicesSection(servicesData) {
  if (!servicesData) return '';

  const serviceItems = servicesData.offerings
    .map((service, index) => {
      const isLast = index === servicesData.offerings.length - 1;
      const borderStyle = isLast ? '' : 'border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;';
      
      return `
        <div class="service-item" style="display: flex; ${borderStyle}">
          <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(20, 184, 166, 0.12); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent);">
            ${service.icon}
          </div>
          <div>
            <h4>${service.title}</h4>
            <div class="service-desc">${service.description}</div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="card" style="margin-top: 18px">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div>
          <div style="font-weight: 700">${servicesData.title}</div>
          <div style="color: var(--muted); font-size: 13px; margin-top: 6px">
            ${servicesData.subtitle}
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <a class="btn btn-primary" href="${servicesData.topmateUrl}" target="_blank" rel="noopener">Book on Topmate</a>
        </div>
      </div>
      <div class="services" style="margin-top: 12px">
        ${serviceItems}
      </div>
    </section>
  `;
}

/**
 * Generate about section HTML
 */
function generateAboutSection(aboutData) {
  if (!aboutData) return '';

  const descriptions = aboutData.description
    .map((para) => `<p style="margin: 0 0 16px 0; line-height: 1.6">${para}</p>`)
    .join('');

  const technologies = aboutData.technologies.map((tech) => createChip(tech)).join('');
  const interests = aboutData.interests.map((interest) => createChip(interest)).join('');

  return `
    <section class="card" style="margin-top: 18px">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px">
        <div>
          <div style="font-weight: 700; font-size: 20px">${aboutData.title}</div>
          <div style="color: var(--muted); font-size: 14px; margin-top: 4px">${aboutData.subtitle}</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start">
        <div>
          ${descriptions}
        </div>
        <div>
          <div style="margin-bottom: 16px">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted)">Core Technologies</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px">
              ${technologies}
            </div>
          </div>
          <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted)">Interests</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px">
              ${interests}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Generate projects section HTML
 */
function generateProjectsSection(projectsData) {
  if (!projectsData) return '';

  const projectItems = projectsData.items
    .map((project) => {
      const technologies = project.technologies.map((tech) => createChip(tech)).join('');
      
      return `
        <div class="project">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px">
            <h3>${project.title}</h3>
            <div style="display: flex; gap: 6px">
              ${technologies}
            </div>
          </div>
          <p>${project.description}</p>
          <div style="margin-top: 8px; font-size: 13px; color: var(--muted)">
            Key achievements: ${project.achievements}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="card" style="margin-top: 18px">
      <div style="margin-bottom: 20px">
        <div style="font-weight: 700; font-size: 20px">${projectsData.title}</div>
        <div style="color: var(--muted); font-size: 14px; margin-top: 4px">${projectsData.subtitle}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px">
        ${projectItems}
      </div>
    </section>
  `;
}

/**
 * Generate side projects section HTML
 */
function generateSideProjectsSection(sideProjectsData) {
  if (!sideProjectsData) return '';

  const sideProjectItems = sideProjectsData.items
    .map((project) => {
      const technologies = project.technologies.map((tech) => createChip(tech)).join('');
      
      return `
        <div class="project" style="padding: 12px">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px">
            <h3 style="margin: 0; font-size: 15px">${project.name}</h3>
            <div style="font-size: 12px; color: var(--muted)">${project.year}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 6px 0">
            ${technologies}
          </div>
          <p style="margin: 0; color: var(--muted); font-size: 14px">${project.description}</p>
        </div>
      `;
    })
    .join('');

  return `
    <section class="card" style="margin-top: 18px">
      <div style="margin-bottom: 18px">
        <div style="font-weight: 700; font-size: 20px">${sideProjectsData.title}</div>
        <div style="color: var(--muted); font-size: 14px; margin-top: 4px">${sideProjectsData.subtitle}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px">
        ${sideProjectItems}
      </div>
    </section>
  `;
}

/**
 * Generate experience section HTML
 */
function generateExperienceSection(experienceData) {
  if (!experienceData) return '';

  const experienceItems = experienceData.items
    .map((job) => {
      const technologies = job.technologies.map((tech) => createChip(tech)).join('');
      const achievements = job.achievements.map((achievement) => `<li>${achievement}</li>`).join('');
      
      return `
        <div style="border-left: 3px solid var(--accent); padding-left: 16px">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px">
            <div>
              <h3 style="margin: 0; font-size: 16px">${job.role}</h3>
              <div style="color: var(--accent); font-size: 14px; margin-top: 2px">${job.company}</div>
            </div>
            <div style="font-size: 13px; color: var(--muted)">${job.period}</div>
          </div>
          <div style="margin-bottom: 12px">
            <div style="display: flex; flex-wrap: wrap; gap: 6px">
              ${technologies}
            </div>
          </div>
          <ul style="margin: 0; padding-left: 20px; color: var(--muted); font-size: 14px">
            ${achievements}
          </ul>
        </div>
      `;
    })
    .join('');

  return `
    <section class="card" style="margin-top: 18px">
      <div style="margin-bottom: 20px">
        <div style="font-weight: 700; font-size: 20px">${experienceData.title}</div>
        <div style="color: var(--muted); font-size: 14px; margin-top: 4px">${experienceData.subtitle}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px">
        ${experienceItems}
      </div>
    </section>
  `;
}

/**
 * Main build function
 */
function build() {
  console.log('🚀 Starting static site generation...\n');

  // Read site data
  console.log('📖 Reading site-data.json...');
  const siteData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log('✅ Site data loaded\n');

  // Minify CSS
  console.log('🎨 Minifying CSS...');
  const cssContent = fs.readFileSync(CSS_SOURCE, 'utf-8');
  const minifiedCSS = minifyCSS(cssContent);
  fs.writeFileSync(CSS_OUTPUT, minifiedCSS, 'utf-8');
  const cssSavings = ((1 - minifiedCSS.length / cssContent.length) * 100).toFixed(1);
  console.log(`✅ CSS minified (${cssSavings}% smaller)\n`);

  // Minify JavaScript
  console.log('⚡ Minifying JavaScript...');
  const jsContent = fs.readFileSync(JS_SOURCE, 'utf-8');
  const minifiedJS = minifyJS(jsContent);
  fs.writeFileSync(JS_OUTPUT, minifiedJS, 'utf-8');
  const jsSavings = ((1 - minifiedJS.length / jsContent.length) * 100).toFixed(1);
  console.log(`✅ JavaScript minified (${jsSavings}% smaller)\n`);

  // Read template
  console.log('📖 Reading template...');
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  console.log('✅ Template loaded\n');

  // Generate sections
  console.log('🔨 Generating HTML sections...');
  const servicesHtml = generateServicesSection(siteData.services);
  const aboutHtml = generateAboutSection(siteData.about);
  const projectsHtml = generateProjectsSection(siteData.projects);
  const sideProjectsHtml = generateSideProjectsSection(siteData.sideProjects);
  const experienceHtml = generateExperienceSection(siteData.experience);
  const socialLinksHtml = generateSocialLinks(siteData.socialLinks);
  console.log('✅ Sections generated\n');

  // Replace placeholders in template
  console.log('🔄 Replacing placeholders...');
  template = template
    .replaceAll('{{SOCIAL_LINKS}}', socialLinksHtml)
    .replaceAll('{{PERSONAL_NAME}}', siteData.personal.name)
    .replaceAll('{{PERSONAL_TITLE}}', siteData.personal.title)
    .replaceAll('{{PERSONAL_LOGO}}', siteData.personal.logo)
    .replaceAll('{{PERSONAL_TAGLINE}}', siteData.personal.tagline)
    .replaceAll('{{PERSONAL_DESCRIPTION}}', siteData.personal.description)
    .replaceAll('{{PERSONAL_LOCATION}}', siteData.personal.location)
    .replaceAll('{{PERSONAL_EMAIL}}', siteData.personal.email)
    .replaceAll('{{PERSONAL_RESUME_URL}}', siteData.personal.resumeUrl)
    .replaceAll('{{SERVICES_SECTION}}', servicesHtml)
    .replaceAll('{{ABOUT_SECTION}}', aboutHtml)
    .replaceAll('{{PROJECTS_SECTION}}', projectsHtml)
    .replaceAll('{{SIDE_PROJECTS_SECTION}}', sideProjectsHtml)
    .replaceAll('{{EXPERIENCE_SECTION}}', experienceHtml)
    .replaceAll('{{CURRENT_YEAR}}', new Date().getFullYear())
    .replaceAll('{{PRIVACY_DATE}}', new Date().toLocaleDateString());
  console.log('✅ Placeholders replaced\n');

  // Minify HTML
  console.log('📦 Minifying HTML...');
  const htmlSize = template.length;
  const minifiedHTML = minifyHTML(template);
  const htmlSavings = ((1 - minifiedHTML.length / htmlSize) * 100).toFixed(1);
  console.log(`✅ HTML minified (${htmlSavings}% smaller)\n`);

  // Write output
  console.log('💾 Writing index.html...');
  fs.writeFileSync(OUTPUT_FILE, minifiedHTML, 'utf-8');
  console.log('✅ index.html generated successfully!\n');

  console.log('🎉 Build complete!\n');
  
  // Summary
  console.log('📊 Summary:');
  console.log(`   CSS:  ${(cssContent.length / 1024).toFixed(1)}KB → ${(minifiedCSS.length / 1024).toFixed(1)}KB (${cssSavings}% smaller)`);
  console.log(`   JS:   ${(jsContent.length / 1024).toFixed(1)}KB → ${(minifiedJS.length / 1024).toFixed(1)}KB (${jsSavings}% smaller)`);
  console.log(`   HTML: ${(htmlSize / 1024).toFixed(1)}KB → ${(minifiedHTML.length / 1024).toFixed(1)}KB (${htmlSavings}% smaller)\n`);
}

// Run build
try {
  build();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}


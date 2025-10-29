# Technical Documentation

> Comprehensive technical documentation for the 0xdps portfolio website

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Build System](#build-system)
- [Development Workflow](#development-workflow)
- [SEO Implementation](#seo-implementation)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Configuration Files](#configuration-files)
- [Scripts Reference](#scripts-reference)

---

## Overview

This is a **static portfolio website** built with a custom build-time rendering system. The site uses a data-driven approach where all content is stored in JSON format and compiled into HTML using Handlebars templating engine.

**Key Features:**
- 🚀 Zero runtime dependencies (pure HTML/CSS/JS)
- 📦 Build-time HTML generation from JSON data
- 🎨 Theme switching (light/dark mode)
- ⚡ Optimized assets (minified CSS/JS)
- 🔍 SEO optimized with structured data
- 📱 Fully responsive design
- 🎯 Privacy-focused (no tracking/analytics)

---

## Architecture

### Build-Time Rendering

The website follows a **static site generation (SSG)** approach:

```
data/site-data.json + index.template.html
              ↓
         [build.js]
              ↓
       Handlebars Compilation
              ↓
         index.html
```

**Why this architecture?**
1. **Performance**: Pre-rendered HTML serves instantly (no client-side rendering)
2. **SEO**: Search engines get fully rendered content
3. **Simplicity**: No runtime dependencies or frameworks
4. **Hosting**: Can be hosted on any static hosting service

---

## Project Structure

```
0xdps/
├── assets/
│   ├── css/
│   │   ├── styles.css              # Source CSS
│   │   └── styles.min.css          # Minified CSS (generated)
│   ├── js/
│   │   ├── scripts.js              # Source JavaScript
│   │   └── scripts.min.js          # Minified JS (generated)
│   ├── profile.jpg                 # Profile image (original)
│   ├── profile.webp                # Profile image (optimized)
│   └── Devendra_Pratap_Singh_Resume.pdf
│
├── data/
│   └── site-data.json              # Single source of truth for all content
│
├── node_modules/                   # Dependencies (gitignored)
│
├── build.js                        # Static site generator
├── index.template.html             # Handlebars template
├── index.html                      # Generated HTML (output)
│
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Locked dependency versions
│
├── favicon.svg                     # Site favicon
├── robots.txt                      # Search engine directives
├── sitemap.xml                     # Sitemap for SEO
├── sitemap.xsl                     # Sitemap stylesheet
│
├── vercel.json                     # Vercel deployment config
└── README.md                       # GitHub profile README
```

### Key Directories

**`data/`**
- Contains `site-data.json` - the single source of truth for all website content
- Structured data includes: personal info, about, services, projects, experience, education, skills, social links

**`assets/`**
- Static assets (CSS, JS, images)
- Source files and their minified versions
- Images optimized for web (WebP format)

**`build.js`**
- Custom static site generator
- Reads `site-data.json` and `index.template.html`
- Compiles them using Handlebars
- Outputs `index.html`

---

## Build System

### Core Build Script (`build.js`)

The build script is a Node.js module that:
1. Reads JSON data from `data/site-data.json`
2. Reads Handlebars template from `index.template.html`
3. Registers custom Handlebars helpers
4. Compiles template with data
5. Writes output to `index.html`

**Custom Handlebars Helpers:**

```javascript
// Renders a technology chip
{{chip "React"}} → <span class="tech-chip">React</span>

// Renders social media SVG icons
{{socialIcon "linkedin"}} → <svg>...</svg>

// Dynamic year for copyright
{{year}} → 2025

// Current date for privacy policy
{{date}} → 10/29/2025
```

### Build Process Flow

```bash
npm run build
```

**Step-by-step execution:**

1. **Parallel Minification**
   ```bash
   # CSS minification
   esbuild assets/css/styles.css --minify --outfile=assets/css/styles.min.css
   
   # JS minification
   esbuild assets/js/scripts.js --minify --outfile=assets/js/scripts.min.js
   ```

2. **HTML Generation**
   ```bash
   node build.js
   ```

3. **HTML Minification**
   ```bash
   html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true -o index.html index.html
   ```

**Result:** Fully optimized, production-ready static HTML file

---

## Development Workflow

### Setup

```bash
# Clone repository
git clone https://github.com/0xdps/0xdps.git
cd 0xdps

# Install dependencies
npm install
```

### Development Mode

```bash
npm run dev
```

**What happens:**
- Starts file watcher on:
  - `data/site-data.json`
  - `index.template.html`
  - `assets/css/styles.css`
  - `assets/js/scripts.js`
- Runs `npm run build` on any file change
- Starts live reload server on `http://localhost:8000`
- Auto-refreshes browser on changes

### Manual Commands

```bash
# Minify CSS only
npm run minify:css

# Minify JS only
npm run minify:js

# Generate HTML from template
npm run generate:html

# Full production build
npm run build
```

### Making Content Changes

**Edit `data/site-data.json`:**
```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title"
  }
}
```

Save → Auto-rebuild → Browser refreshes

**No code changes needed** for content updates!

---

## SEO Implementation

### Meta Tags

**Basic SEO:**
```html
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="...">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://dps.codes/">
```

**Open Graph (Facebook, LinkedIn):**
```html
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://dps.codes/">
<meta property="og:image" content="https://dps.codes/assets/profile.webp">
```

**Twitter Cards:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@0xdps">
<meta name="twitter:title" content="...">
<meta name="twitter:image" content="...">
```

### Structured Data (JSON-LD)

Implements Schema.org `Person` type for rich search results:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Devendra Pratap Singh",
  "alternateName": ["0xdps", "DPS"],
  "url": "https://dps.codes/",
  "jobTitle": "Engineering Leader / Senior Backend Engineer",
  "knowsAbout": ["Backend Development", "System Design", ...],
  "sameAs": [
    "https://www.linkedin.com/in/0xdps",
    "https://github.com/0xdps"
  ]
}
```

**Benefits:**
- Enhanced Google search results
- Knowledge graph eligibility
- Social media profile linking

### Sitemap

**`sitemap.xml`:**
```xml
<url>
  <loc>https://dps.codes/</loc>
  <lastmod>2025-10-29</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1.0</priority>
</url>
```

Submit to:
- Google Search Console
- Bing Webmaster Tools

### Robots.txt

```
User-agent: *
Allow: /
Sitemap: https://dps.codes/sitemap.xml
```

---

## Performance Optimizations

### Asset Optimization

**CSS Minification:**
- Source: `assets/css/styles.css`
- Output: `assets/css/styles.min.css`
- Tool: esbuild (fast, minimal overhead)

**JS Minification:**
- Source: `assets/js/scripts.js`
- Output: `assets/js/scripts.min.js`
- Tool: esbuild

**HTML Minification:**
- Removes whitespace
- Removes comments
- Inlines minified CSS/JS
- Tool: html-minifier-terser

**Image Optimization:**
- WebP format for profile images
- Reduced file size vs JPEG/PNG
- Maintains visual quality

### Loading Strategy

**CSS:**
```html
<link rel="stylesheet" href="assets/css/styles.min.css">
```
- Loaded in `<head>` for immediate styling (prevents FOUC)

**JS:**
```html
<script src="assets/js/scripts.min.js"></script>
```
- Loaded at end of `<body>` (non-blocking)

**Third-party Scripts:**
```html
<script data-cfasync="false" src="..."></script>
```
- Buy Me A Coffee widget loaded asynchronously

### Performance Metrics

**Expected Lighthouse Scores:**
- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 100

**Why so fast?**
- Static HTML (no server-side rendering)
- Minified assets
- No heavy frameworks
- Optimized images
- Minimal third-party scripts

---

## Deployment

### Vercel (Current)

**Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "installCommand": "npm install",
  "framework": null,
  "devCommand": "npm run dev"
}
```

**Deployment Steps:**
1. Push to GitHub
2. Vercel auto-deploys from `master` branch
3. Build runs: `npm install && npm run build`
4. Serves static files from root

**Custom Domain:**
- Primary: `dps.codes`
- Auto HTTPS via Vercel

### Alternative Hosting Options

This static site can be hosted on:

**Netlify:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "."
```

**GitHub Pages:**
```yaml
# .github/workflows/deploy.yml
- run: npm install
- run: npm run build
- uses: peaceiris/actions-gh-pages@v3
```

**Cloudflare Pages:**
- Build command: `npm run build`
- Output directory: `/`

**Any static host:** Just upload `index.html`, `assets/`, and root files

---

## Technologies Used

### Core Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Build environment | ≥14.0.0 |
| **Handlebars** | Templating engine | ^4.7.8 |
| **esbuild** | CSS/JS minification | ^0.19.0 |

### Build Tools

| Tool | Purpose | Version |
|------|---------|---------|
| **html-minifier-terser** | HTML minification | ^7.2.0 |
| **chokidar-cli** | File watching | ^3.0.0 |
| **npm-run-all** | Parallel script execution | ^4.1.5 |
| **reload** | Live reload server | ^3.4.2 |

### Frontend

| Technology | Purpose |
|-----------|---------|
| **Vanilla JavaScript** | Theme switching, modal |
| **CSS Custom Properties** | Theming (light/dark) |
| **CSS Grid/Flexbox** | Layout |

### Third-party Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Buy Me A Coffee** | Donation widget | External script |
| **Topmate** | Booking services | External link |

---

## Configuration Files

### `package.json`

**Scripts breakdown:**

```json
{
  "minify:css": "esbuild assets/css/styles.css --minify --outfile=assets/css/styles.min.css",
  "minify:js": "esbuild assets/js/scripts.js --minify --outfile=assets/js/scripts.min.js",
  "generate:html": "node build.js",
  "minify:html": "html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true -o index.html index.html",
  "build": "npm-run-all --parallel minify:css minify:js generate:html --sequential minify:html",
  "watch": "chokidar 'data/site-data.json' 'index.template.html' 'assets/css/styles.css' 'assets/js/scripts.js' -c 'npm run build'",
  "serve": "reload -b -p 8000 -d .",
  "dev": "npm-run-all --parallel watch serve"
}
```

**Engine requirement:**
```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### `vercel.json`

Configures Vercel deployment:
- Build command
- Output directory
- Framework (none - custom)

### `.gitignore` (Recommended)

```
node_modules/
index.html
assets/css/styles.min.css
assets/js/scripts.min.js
.DS_Store
*.log
```

**Why ignore `index.html`?**
- It's a build artifact
- Generated from template + data
- Source of truth is in template + JSON

---

## Scripts Reference

### Production Build

```bash
npm run build
```

**Use case:** Before deploying or committing changes

**Output:**
- `assets/css/styles.min.css`
- `assets/js/scripts.min.js`
- `index.html` (minified)

### Development Server

```bash
npm run dev
```

**Features:**
- File watcher on source files
- Auto-rebuild on changes
- Live reload browser
- Local server on port 8000

### Individual Tasks

```bash
# CSS only
npm run minify:css

# JS only
npm run minify:js

# HTML generation (no minification)
npm run generate:html

# HTML minification (run after generate:html)
npm run minify:html
```

### File Watching

```bash
npm run watch
```

**Watches:**
- `data/site-data.json`
- `index.template.html`
- `assets/css/styles.css`
- `assets/js/scripts.js`

**Runs:** `npm run build` on any change

### Local Server

```bash
npm run serve
```

**Features:**
- Serves files from root directory
- Port: 8000
- Auto-opens browser
- Live reload enabled

---

## Data Schema Reference

### `site-data.json` Structure

```javascript
{
  "personal": {
    "name": "String",
    "title": "String",
    "logo": "String",
    "tagline": "String",
    "description": "String",
    "location": "String",
    "email": "String",
    "phone": "String",
    "resumeUrl": "String"
  },
  
  "about": {
    "title": "String",
    "subtitle": "String",
    "description": ["String", "String", ...],
    "technologies": ["String", ...],
    "interests": ["String", ...]
  },
  
  "services": {
    "title": "String",
    "subtitle": "String",
    "topmateUrl": "String",
    "offerings": [{
      "icon": "String",
      "title": "String",
      "description": "String"
    }]
  },
  
  "projects": {
    "title": "String",
    "subtitle": "String",
    "items": [{
      "title": "String",
      "technologies": ["String", ...],
      "description": "String",
      "achievements": "String"
    }]
  },
  
  "sideProjects": {
    "title": "String",
    "subtitle": "String",
    "items": [{
      "name": "String",
      "year": Number,
      "description": "String",
      "technologies": ["String", ...]
    }]
  },
  
  "experience": {
    "title": "String",
    "subtitle": "String",
    "items": [{
      "role": "String",
      "company": "String",
      "period": "String",
      "technologies": ["String", ...],
      "achievements": ["String", ...]
    }]
  },
  
  "education": {
    "degree": "String",
    "institution": "String",
    "period": "String",
    "grade": "String"
  },
  
  "skills": {
    "primary": ["String", ...],
    "databases": ["String", ...],
    "devops": ["String", ...],
    "others": ["String", ...]
  },
  
  "socialLinks": [{
    "name": "String",
    "url": "String",
    "icon": "String"  // must match registered Handlebars helper
  }]
}
```

---

## Maintenance & Updates

### Content Updates

1. Edit `data/site-data.json`
2. Run `npm run build`
3. Test locally: `npm run serve`
4. Commit and push

### Design Updates

**CSS Changes:**
1. Edit `assets/css/styles.css`
2. Run `npm run minify:css`
3. Test changes

**JS Changes:**
1. Edit `assets/js/scripts.js`
2. Run `npm run minify:js`
3. Test functionality

**Template Changes:**
1. Edit `index.template.html`
2. Run `npm run generate:html`
3. Review output

### Adding New Sections

1. Add data to `site-data.json`
2. Add corresponding HTML in `index.template.html`
3. Optionally add CSS styles
4. Rebuild and test

### SEO Updates

**Update sitemap:**
```xml
<lastmod>2025-10-29</lastmod>  <!-- Update this -->
```

**Update meta tags:**
Edit `index.template.html` `<head>` section

---

## Troubleshooting

### Build Fails

**Check Node.js version:**
```bash
node --version  # Should be ≥14.0.0
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### File Watch Not Working

**Clear watch cache:**
```bash
# Kill all node processes
pkill node

# Restart dev server
npm run dev
```

### Minification Issues

**Check source files:**
- Valid CSS syntax in `styles.css`
- Valid JS syntax in `scripts.js`

**Manual minification test:**
```bash
npm run minify:css  # Should output to styles.min.css
npm run minify:js   # Should output to scripts.min.js
```

### Template Errors

**Handlebars compilation fails:**
- Check matching opening/closing tags
- Verify helper names match registered helpers
- Check JSON syntax in `site-data.json`

**Validate JSON:**
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('data/site-data.json')))"
```

---

## Best Practices

### Version Control

**Commit source files only:**
- ✅ `data/site-data.json`
- ✅ `index.template.html`
- ✅ `assets/css/styles.css`
- ✅ `assets/js/scripts.js`
- ❌ `index.html` (generated)
- ❌ `*.min.css`, `*.min.js` (generated)

### Content Management

**Use JSON for all content:**
- Easier to maintain
- Single source of truth
- Version control friendly
- Validation possible

### Development Workflow

1. Make changes to source files
2. Test locally with `npm run dev`
3. Review in browser
4. Run `npm run build` before committing
5. Push to deploy

---

## Future Enhancements

### Potential Improvements

**Content Management:**
- [ ] Add CMS integration (Contentful, Sanity)
- [ ] Markdown support for blog posts
- [ ] Multi-language support

**Build System:**
- [ ] Add image optimization pipeline
- [ ] Generate multiple page sizes (mobile/desktop)
- [ ] Add critical CSS inlining

**Features:**
- [ ] Blog section with RSS feed
- [ ] Contact form with serverless function
- [ ] Code syntax highlighting for technical content
- [ ] Search functionality

**SEO:**
- [ ] Generate meta images dynamically
- [ ] Add breadcrumbs schema
- [ ] Implement AMP version

**Performance:**
- [ ] Service worker for offline support
- [ ] Implement PWA features
- [ ] Add resource hints (preconnect, prefetch)

---

## License

MIT License - Feel free to use this architecture for your own projects!

---

## Support

For questions or issues related to this technical documentation:
- 📧 Email: dps.manit@gmail.com
- 🐦 Twitter: [@0xdps](https://twitter.com/0xdps)
- 💼 LinkedIn: [0xdps](https://linkedin.com/in/0xdps)

---

**Last Updated:** October 29, 2025
**Version:** 2.0.0


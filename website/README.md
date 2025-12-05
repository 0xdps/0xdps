# Website Source Files

This directory contains all source files for the portfolio website.

## 📁 Structure

```
website/
├── index.template.html        # Main HTML template (Handlebars)
├── data/
│   └── site-data.json         # Website content & configuration
├── assets/
│   ├── css/
│   │   └── styles.css         # Source CSS
│   ├── js/
│   │   └── scripts.js         # Source JavaScript
│   ├── profile/
│   │   └── profile.webp       # Profile image
│   └── resume/
│       └── Devendra_Pratap_Singh.pdf
├── privacy/
│   ├── index.html             # Privacy policy pages
│   └── [project-name].html    # Individual project privacy pages
├── sitemap.template.xml       # Sitemap template
├── sitemap.template.xsl       # Sitemap stylesheet
├── robots.txt                 # Search engine directives
└── favicon.svg                # Site favicon
```

## 🎨 Template System

The website uses **Handlebars** for templating with the following helpers:

### Custom Helpers

- `{{chip "text"}}` - Renders a technology chip
- `{{socialIcon "name"}}` - Renders social media SVG icons
- `{{year}}` - Current year (for copyright)
- `{{date}}` - Current date (for privacy policy)

### Template Syntax

```handlebars
<!-- Conditional sections -->
{{#if section}}
  <div>Content</div>
{{/if}}

<!-- Loops -->
{{#each items}}
  <div>{{this.title}}</div>
{{/each}}

<!-- Data binding -->
<h1>{{personal.name}}</h1>
```

## 📝 Content Management

All website content is managed through `data/site-data.json`:

### Main Sections

1. **personal** - Name, title, contact info
2. **about** - Biography, skills, interests
3. **services** - Topmate offerings
4. **projects** - Featured projects
5. **sideProjects** - Side projects
6. **experience** - Work history
7. **education** - Educational background
8. **skills** - Technical skills
9. **socialLinks** - Social media profiles

### Editing Content

1. Open `data/site-data.json`
2. Edit the relevant section
3. Save the file
4. Run `npm run build` to regenerate

Example:
```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com"
  }
}
```

## 🎨 Styling

### CSS Structure

`assets/css/styles.css` uses:
- CSS Custom Properties for theming
- Mobile-first responsive design
- Light/dark theme support

### Theme Variables

```css
:root {
  --accent: #14b8a6;
  --text: #1f2937;
  --background: #ffffff;
  /* ... more variables */
}

[data-theme="dark"] {
  --text: #f9fafb;
  --background: #111827;
  /* ... dark theme overrides */
}
```

## 🔧 JavaScript

`assets/js/scripts.js` handles:
- Theme toggle (light/dark mode)
- Privacy modal
- Local storage for theme preference

## 🏗️ Build Process

The source files are compiled into production-ready static files:

```
website/ → [build process] → build/
```

### Build Steps

1. **Copy Assets** - Static files copied to build/
2. **Minify CSS** - CSS minified to build/assets/css/
3. **Minify JS** - JS minified to build/assets/js/
4. **Generate HTML** - Template + data → HTML
5. **Minify HTML** - Final HTML minification

### Commands

```bash
# Full build
npm run build

# Development mode (watch + serve)
npm run dev

# Individual steps
npm run copy:assets
npm run minify:css
npm run minify:js
npm run generate:html
```

## 📐 Template Layout

### Header
- Logo and name
- Theme toggle
- Social links

### Hero Section
- Tagline
- Description
- Call-to-action buttons
- Profile image

### Services Section
- Topmate offerings
- 1-on-1 sessions
- Mock interviews

### About Section
- Biography
- Technologies
- Interests

### Projects Section
- Featured projects
- Side projects

### Experience Section
- Work history
- Technologies used
- Key achievements

### Footer
- Copyright
- Privacy link

## 🔍 SEO

### Meta Tags

All meta tags are in `index.template.html`:
- Basic SEO (title, description, keywords)
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Mobile optimization

### Structured Data

JSON-LD structured data is included for:
- Person schema
- Job title
- Skills
- Social profiles
- Work organization

### Sitemap

`sitemap.template.xml` includes:
- Homepage URL
- Dynamic last modified date
- Change frequency
- Priority settings

## 🎯 Privacy Pages

Each project has its own privacy policy page in `privacy/`:

- Generic privacy policy: `privacy/index.html`
- Project-specific: `privacy/[project-name].html`

These are static HTML files served directly.

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Grid layouts automatically adjust based on screen size.

## 🌙 Dark Mode

Dark mode is implemented using:
- CSS custom properties
- `data-theme` attribute on `<body>`
- Local storage for persistence
- System preference detection

Toggle using the moon/sun icon in the header.

## 📦 Assets

### Images

- **Profile**: `assets/profile/profile.webp` (WebP format)
- **Favicon**: `favicon.svg` (SVG for crisp scaling)

### Documents

- **Resume**: `assets/resume/Devendra_Pratap_Singh.pdf`

## 🔄 Workflow

### Making Changes

1. **Content**: Edit `data/site-data.json`
2. **Styles**: Edit `assets/css/styles.css`
3. **Scripts**: Edit `assets/js/scripts.js`
4. **Template**: Edit `index.template.html`
5. **Build**: Run `npm run build`
6. **Test**: Check `build/index.html`

### Development

```bash
# Start dev server
npm run dev

# Opens http://localhost:8000
# Auto-rebuilds on file changes
# Live reload in browser
```

## 📄 File Formats

- **HTML**: Handlebars templates (`.html`)
- **CSS**: Plain CSS with custom properties
- **JS**: ES6+ JavaScript
- **Data**: JSON format
- **Images**: WebP (optimized)
- **Documents**: PDF

## 🚀 Deployment

The built files in `build/` are deployed to Vercel:

1. Push changes to GitHub
2. Vercel auto-builds: `npm run build`
3. Vercel serves from `build/` directory
4. Live at: https://dps.codes

## 📝 Notes

- Keep `site-data.json` well-formatted for readability
- Use consistent spacing in templates
- Test theme toggle after CSS changes
- Validate HTML after template changes
- Optimize images before adding new ones
- Keep privacy pages up to date

---

**Last Updated**: December 5, 2025  
**Template Engine**: Handlebars  
**Build Tool**: Custom Node.js scripts


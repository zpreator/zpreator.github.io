# Personal Portfolio Website

A modern, responsive portfolio website built for GitHub Pages with **fully automated content management**. Update your resume and project details in markdown files, and the website automatically reflects the changes!

## 🚀 Live Demo

Your portfolio is live at: `https://zpreator.github.io`

## ✨ Features

- **🤖 Fully Automated Content** - Update markdown files, website updates automatically
- **📝 Content-Driven** - All content pulled from organized markdown files
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🎨 Modern UI/UX** - Clean, professional design with smooth animations
- **🔄 Dynamic Updates** - Changes to resume.md automatically update the website
- **📂 Organized Structure** - Separate markdown files for each project and section
- **📄 PDF Resume Download** - One-click download of your resume as PDF
- **⚡ Performance Optimized** - Fast loading with optimized assets
- **🔍 SEO Friendly** - Proper meta tags and semantic HTML

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript** - Dynamic content loading and interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter font family)
- **Markdown** - Content management

## 📁 File Structure

```
├── index.html              # Main HTML file (rarely needs editing)
├── styles.css             # CSS styles and responsive design
├── script.js              # JavaScript for dynamic content loading
├── resume.md              # Your main resume (source of truth)
├── content/               # Content directory for website sections
│   ├── README.md          # Documentation for content structure
│   ├── about.md           # About Me section content
│   └── projects/          # Individual project markdown files
│       ├── ai-text-adventure.md
│       ├── moovmetrics.md
│       ├── sheep-launcher.md
│       └── twitter-bot.md
├── images/                # Image assets
│   ├── profile/           # Profile images
│   └── projects/          # Project screenshots
└── sheep_launcher/        # Embedded Unity game

```

## 🎯 How It Works

The website automatically loads content from markdown files:

1. **Hero Summary** - Pulled from `resume.md` Summary section
2. **Experience & Education Timeline** - Dynamically generated from `resume.md` Experience and Education sections
3. **About Section** - Loaded from `content/about.md`
4. **Projects** - Dynamically generated from `content/projects/*.md` files
5. **Years of Experience** - Automatically calculated from start date in `script.js`

## 📝 Content Management

### Updating Your Resume

Edit `resume.md` to update:
- **Summary** (appears in hero section)
- **Experience** (appears in timeline)
- **Education** (appears in timeline)
- Technical Skills

The website will automatically:
- Pull the summary for the hero section
- Parse all experience entries and display them chronologically
- Parse all education entries and interleave them with experience
- Sort everything by date (most recent first)

### Updating About Section

Edit `content/about.md` to change the About Me section. The `{YEARS}` placeholder will be automatically replaced with your calculated years of experience.

### Adding/Updating Projects

Each project has its own markdown file in `content/projects/`. 

**Project File Format:**
```markdown
# Project Title

## Description
One-paragraph description shown on the project card

## Details
- Bullet point 1
- Bullet point 2

## Technologies
Comma-separated list (e.g., Python, Flask, SQLite)

## Links
- github: https://github.com/username/repo
- demo: ./path/to/demo
- website: https://example.com

## Image
filename.jpg (place in images/projects/)

## Status
Active/Complete/Prototype

## Year
2024 or 2023-2025
```

### Adding a New Project

1. Create a new `.md` file in `content/projects/`
2. Follow the format above
3. Add project image to `images/projects/`
4. Add the filename to the `projectFiles` array in `script.js`:

```javascript
const projectFiles = [
    'ai-text-adventure.md',
    'moovmetrics.md',
    'sheep-launcher.md',
    'twitter-bot.md',
    'your-new-project.md'  // Add here
];
```

## 📄 Generating PDF Resume

The website includes a "Download Resume" button that **automatically generates a PDF from your resume.md in real-time using JavaScript**. No external tools or manual PDF generation needed!

### How It Works

When visitors click "Download Resume":
1. The browser fetches your `resume.md` file
2. JavaScript parses the markdown content
3. A professional PDF is generated on-the-fly using jsPDF
4. The PDF is automatically downloaded

### What You Need to Do

**Nothing!** Just keep your `resume.md` updated, and the PDF generation happens automatically in the browser.

### Features

✅ **Zero maintenance** - No need to regenerate PDFs manually
✅ **Always up-to-date** - PDF reflects current resume.md content
✅ **Professional formatting** - Clean, well-structured PDF output
✅ **Includes all sections** - Summary, Experience, Education, Projects, and Skills
✅ **No external dependencies** - Works entirely in the browser

### Testing Locally

Just open your `index.html` in a browser and click "Download Resume" to test.

## 🎨 Customization Guide

### Personal Information

1. **Update Personal Details** in `index.html`:
   - Change "Zachary Preator" to your name
   - Update the hero subtitle
   - Replace social links in contact section

2. **Profile Image**:
   - Place your image in `images/profile/`
   - Update the src in `index.html` hero section
   - Recommended size: 300x300px

3. **Years of Experience**:
   - Edit `startDate` in `script.js` (currently set to '2020-08-01')

### Styling and Colors

The website uses a modern color scheme with CSS custom properties. To change colors, edit `styles.css`:

1. **Primary Colors**: The main theme uses purple/indigo gradient (`#6366f1` to `#8b5cf6`)
2. **Text Colors**: Various shades of gray for different text elements
3. **Background**: Clean white and light gray backgrounds

### Adding New Sections

To add a new section:

1. Create a markdown file in `content/` if it's content-driven
2. Add the HTML structure in `index.html` for the section layout
3. Add corresponding styles in `styles.css`
4. Update navigation menu if needed
5. Add JavaScript loading function in `script.js` if dynamic

## 🔧 Advanced: Making More Sections Dynamic

You can extend the automation to other sections like Experience or Skills:

1. Create a markdown file (e.g., `content/experience.md`)
2. Add a parsing function in `script.js` (similar to `parseProjectMarkdown`)
3. Create HTML generation function
4. Call it in the `DOMContentLoaded` event

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 Deployment

### GitHub Pages Setup

1. **Repository Settings**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" or "master" branch
   - Select "/ (root)" folder
   - Click "Save"

2. **Custom Domain** (Optional):
   - Add a `CNAME` file with your custom domain
   - Update DNS settings with your domain provider

### Quick Deployment Steps

```bash
# Clone your repository
git clone https://github.com/zpreator/zpreator.github.io.git
cd zpreator.github.io

# Add files and commit
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

## 🔧 Local Development

To run locally:

1. **Simple HTTP Server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server
   ```

2. **VS Code Live Server**:
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

## 📋 Customization Checklist

- [ ] Update personal information (name, title, description)
- [ ] Replace profile image
- [ ] Update about section content
- [ ] Modify skills and technologies
- [ ] Add your actual projects
- [ ] Update contact information
- [ ] Test on different devices
- [ ] Verify all links work
- [ ] Optimize images for web
- [ ] Add Google Analytics (optional)

## 🎯 SEO Optimization

The template includes basic SEO optimization:
- Semantic HTML structure
- Meta description and keywords
- Open Graph tags for social sharing
- Proper heading hierarchy

To improve SEO further:
- Add more specific meta descriptions
- Include relevant keywords naturally in content
- Add structured data markup
- Optimize images with alt tags

## 📞 Support

If you need help customizing your portfolio:
1. Check the comments in the code files
2. Refer to this README
3. Search for solutions online
4. Consider hiring a developer for advanced customizations

## 📄 License

This template is free to use for personal and commercial projects. No attribution required, but appreciated!

---

**Happy coding! 🚀**

Make sure to customize the content to reflect your personal brand and showcase your best work.
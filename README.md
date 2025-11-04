# Personal Portfolio Website

A modern, responsive portfolio website built for GitHub Pages. This portfolio showcases your skills, projects, and provides a way for potential employers or collaborators to get in touch.

## 🚀 Live Demo

Your portfolio will be live at: `https://zpreator.github.io`

## ✨ Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Interactive Navigation** - Smooth scrolling and active section highlighting
- **Project Showcase** - Dedicated section to display your work
- **Skills Display** - Organized skill categories with modern styling
- **Contact Form** - Functional contact form with validation
- **Performance Optimized** - Fast loading with optimized assets
- **SEO Friendly** - Proper meta tags and semantic HTML

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript** - Interactive functionality and animations
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter font family)

## 📁 File Structure

```
├── index.html          # Main HTML file
├── styles.css         # CSS styles and responsive design
├── script.js          # JavaScript functionality
└── README.md          # This file
```

## 🎨 Customization Guide

### Personal Information

1. **Update Personal Details** in `index.html`:
   - Change "Zachary Preator" to your name
   - Update the hero subtitle and description
   - Replace placeholder email and social links

2. **Profile Image**:
   - Replace the placeholder image URL in the hero section
   - Recommended size: 300x300px
   - Use a professional headshot or avatar

### Content Sections

#### About Section
- Update the about text to reflect your background
- Modify the statistics (years of experience, projects, etc.)

#### Skills Section
- Add or remove skill categories
- Update technologies based on your expertise
- Modify the skill items in each category

#### Projects Section
- Replace placeholder projects with your actual work
- Update project titles, descriptions, and technologies
- Add links to live demos and GitHub repositories
- Replace placeholder images with project screenshots

#### Contact Information
- Update email address
- Add your actual LinkedIn profile
- Update GitHub profile (already set to darthpreator)
- Modify social media links

### Styling and Colors

The website uses a modern color scheme with CSS custom properties. To change colors:

1. **Primary Colors**: The main theme uses purple/indigo gradient (`#6366f1` to `#8b5cf6`)
2. **Text Colors**: Various shades of gray for different text elements
3. **Background**: Clean white and light gray backgrounds

### Adding New Sections

To add a new section:

1. Add the HTML structure in `index.html`
2. Add corresponding styles in `styles.css`
3. Update navigation menu if needed
4. Add any required JavaScript functionality

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
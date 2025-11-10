// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic content configuration
    const contentConfig = {
        startDate: '2020-08-01', // Your first ML/Dev role at Autoliv
        aboutDescription: 'I\'m a Machine Learning Engineer with {YEARS}+ years of experience building and deploying ML models in production. I completed my MS in Computer Science with focus on AI & Machine Learning from Colorado State University in 2024, building on my mechanical engineering foundation that provides robust analytical skills for tackling ML problems from first principles.'
    };
    
    // Calculate years of experience
    const startDate = new Date(contentConfig.startDate);
    const currentDate = new Date();
    const yearsExperience = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25));
    
    // Function to replace placeholders in text
    function replaceYearsPlaceholder(text) {
        return text.replace('{YEARS}', yearsExperience);
    }
    
    // Function to extract summary and experience from resume.md
    async function loadResumeContent() {
        try {
            const response = await fetch('./resume.md');
            const resumeText = await response.text();
            
            // Extract the summary section
            const summaryMatch = resumeText.match(/## Summary\s*\n\n(.*?)(?=\n\n## |$)/s);
            if (summaryMatch) {
                const summaryText = summaryMatch[1].trim();
                
                // Update hero description with resume summary
                const heroDescription = document.getElementById('hero-description');
                if (heroDescription) {
                    heroDescription.innerHTML = replaceYearsPlaceholder(summaryText);
                }
            }
            
            // Extract and load experience section
            loadExperienceFromResume(resumeText);
            
        } catch (error) {
            console.warn('Could not load resume.md, using fallback text:', error);
            // Fallback if resume.md can't be loaded
            const heroDescription = document.getElementById('hero-description');
            if (heroDescription) {
                heroDescription.innerHTML = `Machine Learning Engineer with ${yearsExperience}+ years of experience researching, building, and deploying ML models in production. Known for relentless focus on solving complex technical challenges until breakthrough solutions are achieved.`;
            }
        }
    }
    
    // Function to parse and load experience and education from resume
    function loadExperienceFromResume(resumeText) {
        try {
            // Extract Experience section
            const experienceMatch = resumeText.match(/## Experience\s*\n\n(.*?)(?=\n## |$)/s);
            const educationMatch = resumeText.match(/## Education\s*\n\n(.*?)(?=\n## |$)/s);
            
            if (!experienceMatch && !educationMatch) return;
            
            const timeline = document.querySelector('.timeline');
            if (!timeline) return;
            
            // Clear existing timeline
            timeline.innerHTML = '';
            
            const timelineItems = [];
            
            // Parse experience entries
            if (experienceMatch) {
                const experienceText = experienceMatch[1].trim();
                const expEntries = experienceText.split(/\n(?=\*\*)/);
                
                expEntries.forEach(entry => {
                    const item = parseExperienceEntry(entry, 'experience');
                    if (item) timelineItems.push(item);
                });
            }
            
            // Parse education entries
            if (educationMatch) {
                const educationText = educationMatch[1].trim();
                const eduEntries = educationText.split(/\n(?=\*\*)/);
                
                eduEntries.forEach(entry => {
                    const item = parseExperienceEntry(entry, 'education');
                    if (item) timelineItems.push(item);
                });
            }
            
            // Sort by date (most recent first)
            timelineItems.sort((a, b) => b.sortDate - a.sortDate);
            
            // Add to timeline
            timelineItems.forEach(item => {
                timeline.appendChild(item.element);
            });
            
        } catch (error) {
            console.warn('Could not parse experience/education from resume:', error);
        }
    }
    
    // Function to parse individual experience or education entry
    function parseExperienceEntry(entry, type) {
        try {
            // Match pattern: **Company/School, Title/Degree**, Location - *Date*
            const headerMatch = entry.match(/\*\*(.*?),\s*(.*?)\*\*,?\s*(.*?)\s*-\s*\*(.*?)\*/);
            if (!headerMatch) return null;
            
            const [_, org, title, location, dateRange] = headerMatch;
            
            // Extract bullet points
            const bullets = [];
            const bulletMatches = entry.matchAll(/^- (.+)$/gm);
            for (const match of bulletMatches) {
                bullets.push(match[1]);
            }
            
            // Create timeline item
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            // Determine sort date (use end date or "Present")
            let sortDate = new Date();
            if (dateRange.toLowerCase().includes('present')) {
                sortDate = new Date();
            } else {
                // Try to parse the date
                const dateMatch = dateRange.match(/\w+ \d{4}/g);
                if (dateMatch && dateMatch.length > 0) {
                    const lastDate = dateMatch[dateMatch.length - 1];
                    sortDate = new Date(lastDate);
                }
            }
            
            // Format display based on type
            let displayTitle, displayPeriod, displayDescription;
            
            if (type === 'education') {
                displayTitle = title;
                displayPeriod = `${org} (${dateRange})`;
                displayDescription = bullets.join(' • ');
            } else {
                displayTitle = `${title} - ${org}`;
                displayPeriod = dateRange;
                // Combine bullets into a concise summary
                displayDescription = bullets.map(b => {
                    // Remove bold markdown
                    return b.replace(/\*\*(.*?)\*\*/g, '$1');
                }).join(' • ');
            }
            
            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3>${displayTitle}</h3>
                    <span class="timeline-period">${displayPeriod}</span>
                    <p>${displayDescription}</p>
                </div>
            `;
            
            return { element: timelineItem, sortDate: sortDate };
        } catch (error) {
            console.warn('Error parsing entry:', error);
            return null;
        }
    }
    
    // Function to load about content from markdown
    async function loadAboutContent() {
        try {
            const response = await fetch('./content/about.md');
            const aboutText = await response.text();
            
            // Extract the main content (skip the title)
            const contentMatch = aboutText.match(/^#[^\n]*\n\n([\s\S]*)/);
            if (contentMatch) {
                const content = contentMatch[1].trim();
                const paragraphs = content.split('\n\n');
                
                // Update about description (first paragraph)
                const aboutDescription = document.getElementById('about-description');
                if (aboutDescription && paragraphs.length > 0) {
                    aboutDescription.innerHTML = replaceYearsPlaceholder(paragraphs[0]);
                }
                
                // If there are additional paragraphs, add them
                if (paragraphs.length > 1) {
                    const aboutTextDiv = document.querySelector('.about-text');
                    if (aboutTextDiv) {
                        // Remove existing second paragraph if it exists
                        const existingP = aboutTextDiv.querySelectorAll('p')[1];
                        if (existingP) {
                            existingP.innerHTML = replaceYearsPlaceholder(paragraphs[1]);
                        } else {
                            // Add new paragraph if it doesn't exist
                            const newP = document.createElement('p');
                            newP.innerHTML = replaceYearsPlaceholder(paragraphs[1]);
                            aboutDescription.parentNode.insertBefore(newP, aboutDescription.nextSibling);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Could not load about.md, using fallback text:', error);
            // Fallback to hardcoded content
            const aboutDescription = document.getElementById('about-description');
            if (aboutDescription) {
                aboutDescription.innerHTML = replaceYearsPlaceholder(contentConfig.aboutDescription);
            }
        }
    }
    
    // Function to parse project markdown file
    function parseProjectMarkdown(markdown) {
        const project = {};
        
        // Extract title
        const titleMatch = markdown.match(/^# (.+)$/m);
        project.title = titleMatch ? titleMatch[1] : 'Untitled Project';
        
        // Extract sections
        const descMatch = markdown.match(/## Description\s*\n(.*?)(?=\n##|\n*$)/s);
        project.description = descMatch ? descMatch[1].trim() : '';
        
        const detailsMatch = markdown.match(/## Details\s*\n(.*?)(?=\n##|\n*$)/s);
        project.details = detailsMatch ? detailsMatch[1].trim() : '';
        
        const techMatch = markdown.match(/## Technologies\s*\n(.*?)(?=\n##|\n*$)/s);
        project.technologies = techMatch ? techMatch[1].trim().split(',').map(t => t.trim()) : [];
        
        const linksMatch = markdown.match(/## Links\s*\n(.*?)(?=\n##|\n*$)/s);
        project.links = {};
        if (linksMatch) {
            const linkLines = linksMatch[1].trim().split('\n');
            linkLines.forEach(line => {
                const linkMatch = line.match(/- (\w+):\s*(.+)/);
                if (linkMatch && linkMatch[2].trim()) {
                    project.links[linkMatch[1]] = linkMatch[2].trim();
                }
            });
        }
        
        const imageMatch = markdown.match(/## Image\s*\n(.*?)(?=\n##|\n*$)/s);
        project.image = imageMatch ? imageMatch[1].trim() : 'placeholder.jpg';
        
        const yearMatch = markdown.match(/## Year\s*\n(.*?)(?=\n##|\n*$)/s);
        project.year = yearMatch ? yearMatch[1].trim() : '';
        
        return project;
    }
    
    // Function to create project card HTML
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Create links HTML
        let linksHTML = '';
        const linkIcons = {
            github: 'fab fa-github',
            demo: 'fas fa-gamepad',
            website: 'fas fa-external-link-alt',
            app_store: 'fas fa-mobile-alt'
        };
        
        Object.entries(project.links).forEach(([type, url]) => {
            if (url) {
                const icon = linkIcons[type] || 'fas fa-link';
                const target = url.startsWith('http') ? '_blank' : '_self';
                linksHTML += `<a href="${url}" target="${target}" class="project-link"><i class="${icon}"></i></a>`;
            }
        });
        
        // Create technologies HTML
        const techHTML = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="project-image">
                <img src="images/projects/${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    ${linksHTML}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">
                    ${project.description}
                </p>
                <div class="project-tech">
                    ${techHTML}
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Function to load all projects
    async function loadProjects() {
        try {
            // List of project files (you can expand this or make it dynamic)
            const projectFiles = [
                'ai-text-adventure.md',
                'moovmetrics.md',
                'sheep-launcher.md',
                'twitter-bot.md'
            ];
            
            const projectsGrid = document.querySelector('.projects-grid');
            if (!projectsGrid) return;
            
            // Clear existing projects
            projectsGrid.innerHTML = '';
            
            // Load each project
            for (const filename of projectFiles) {
                try {
                    const response = await fetch(`./content/projects/${filename}`);
                    const markdown = await response.text();
                    const project = parseProjectMarkdown(markdown);
                    const card = createProjectCard(project);
                    projectsGrid.appendChild(card);
                    
                    // Observe the new card for animation
                    observer.observe(card);
                } catch (error) {
                    console.warn(`Could not load project ${filename}:`, error);
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    // Load all content
    loadResumeContent();
    loadAboutContent();
    loadProjects();
    
    // Update stats counter
    const yearsExperienceElement = document.getElementById('years-experience');
    if (yearsExperienceElement) {
        yearsExperienceElement.textContent = `${yearsExperience}+`;
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = navMenu.classList.contains('active') ? 
            'rotate(-45deg) translate(-5px, 6px)' : 'none';
        bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        bars[2].style.transform = navMenu.classList.contains('active') ? 
            'rotate(45deg) translate(-5px, -6px)' : 'none';
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Simple fade-in animation for hero title (replaces problematic typing animation)
    function animateTitle() {
        const titleElement = document.querySelector('.hero-title');
        if (!titleElement) return;

        titleElement.style.opacity = '0';
        titleElement.style.transform = 'translateY(20px)';
        titleElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            titleElement.style.opacity = '1';
            titleElement.style.transform = 'translateY(0)';
        }, 500);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 50;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                    setTimeout(updateCounter, 40);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };

            // Start animation when element is visible
            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterObserver.observe(counter);
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Simple form validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Manual close
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize animations
    animateCounters();
    
    // Add active class styles
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: #6366f1 !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(navStyle);

    // Profile card hover effect only (no parallax)
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(0deg) translateY(-10px)';
        });
        
        profileCard.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(3deg) translateY(0px)';
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        const body = document.body;
        body.classList.add('loaded');
        
        // Start title animation after page load
        setTimeout(animateTitle, 500);
    });
});

// Theme switcher (optional enhancement)
function initThemeSwitcher() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #6366f1;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Store theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    document.body.appendChild(themeToggle);
}

// Uncomment to enable theme switcher
// initThemeSwitcher();
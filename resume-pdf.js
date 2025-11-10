// PDF Resume Generator - Pure JavaScript
// Generates PDF from resume.md on-the-fly

async function generateResumePDF() {
    try {
        // Show loading state
        const btn = document.getElementById('download-resume-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        btn.disabled = true;

        // Fetch resume.md
        const response = await fetch('./resume.md');
        const resumeText = await response.text();

        // Parse and convert markdown to formatted text
        const formattedResume = parseResumeForPDF(resumeText);

        // Generate PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter'
        });

        // Page setup
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = margin;

        // Helper function to add text with word wrap
        function addText(text, fontSize, fontStyle = 'normal', color = [0, 0, 0]) {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', fontStyle);
            doc.setTextColor(color[0], color[1], color[2]);
            
            const lines = doc.splitTextToSize(text, contentWidth);
            
            // Check if we need a new page
            if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            
            doc.text(lines, margin, yPosition);
            yPosition += lines.length * fontSize * 0.5 + 5;
        }

        // Helper function to add a line
        function addLine() {
            if (yPosition > pageHeight - margin - 10) {
                doc.addPage();
                yPosition = margin;
            }
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }

        // Header - Name and Title
        addText(formattedResume.name, 24, 'bold', [31, 41, 55]);
        addText(formattedResume.title, 14, 'normal', [99, 102, 241]);
        yPosition += 5;

        // Contact Information
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const contactInfo = [
            formattedResume.email,
            formattedResume.location,
            formattedResume.linkedin,
            formattedResume.github
        ].filter(Boolean).join(' • ');
        
        const contactLines = doc.splitTextToSize(contactInfo, contentWidth);
        doc.text(contactLines, margin, yPosition);
        yPosition += contactLines.length * 12 + 15;

        addLine();

        // Summary
        if (formattedResume.summary) {
            addText('SUMMARY', 12, 'bold', [99, 102, 241]);
            addText(formattedResume.summary, 10, 'normal', [60, 60, 60]);
            yPosition += 10;
        }

        // Experience
        if (formattedResume.experience && formattedResume.experience.length > 0) {
            addLine();
            addText('EXPERIENCE', 12, 'bold', [99, 102, 241]);
            
            formattedResume.experience.forEach(exp => {
                // Check for page break
                if (yPosition > pageHeight - margin - 100) {
                    doc.addPage();
                    yPosition = margin;
                }
                
                // Company and title
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(31, 41, 55);
                const titleLines = doc.splitTextToSize(`${exp.title} | ${exp.company}`, contentWidth);
                doc.text(titleLines, margin, yPosition);
                yPosition += titleLines.length * 13;
                
                // Location and date
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(`${exp.location} • ${exp.date}`, margin, yPosition);
                yPosition += 15;
                
                // Bullets
                exp.bullets.forEach(bullet => {
                    doc.setFontSize(10);
                    doc.setTextColor(60, 60, 60);
                    const bulletLines = doc.splitTextToSize('• ' + bullet, contentWidth - 10);
                    
                    if (yPosition + (bulletLines.length * 12) > pageHeight - margin) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    
                    doc.text(bulletLines, margin + 5, yPosition);
                    yPosition += bulletLines.length * 12;
                });
                
                yPosition += 10;
            });
        }

        // Education
        if (formattedResume.education && formattedResume.education.length > 0) {
            addLine();
            addText('EDUCATION', 12, 'bold', [99, 102, 241]);
            
            formattedResume.education.forEach(edu => {
                // Check for page break
                if (yPosition > pageHeight - margin - 100) {
                    doc.addPage();
                    yPosition = margin;
                }
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(31, 41, 55);
                const degreeLines = doc.splitTextToSize(`${edu.degree} | ${edu.school}`, contentWidth);
                doc.text(degreeLines, margin, yPosition);
                yPosition += degreeLines.length * 13;
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(`${edu.location} • ${edu.date}`, margin, yPosition);
                yPosition += 15;
                
                if (edu.details.length > 0) {
                    edu.details.forEach(detail => {
                        doc.setFontSize(10);
                        doc.setTextColor(60, 60, 60);
                        const detailLines = doc.splitTextToSize('• ' + detail, contentWidth - 10);
                        doc.text(detailLines, margin + 5, yPosition);
                        yPosition += detailLines.length * 12;
                    });
                }
                
                yPosition += 10;
            });
        }

        // Projects
        if (formattedResume.projects && formattedResume.projects.length > 0) {
            addLine();
            addText('PROJECTS', 12, 'bold', [99, 102, 241]);
            
            formattedResume.projects.forEach(project => {
                // Check for page break
                if (yPosition > pageHeight - margin - 100) {
                    doc.addPage();
                    yPosition = margin;
                }
                
                // Project name and date
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(31, 41, 55);
                const projectTitle = project.date ? `${project.name} (${project.date})` : project.name;
                const titleLines = doc.splitTextToSize(projectTitle, contentWidth);
                doc.text(titleLines, margin, yPosition);
                yPosition += titleLines.length * 13;
                
                // Project bullets
                project.bullets.forEach(bullet => {
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(60, 60, 60);
                    const bulletLines = doc.splitTextToSize('• ' + bullet, contentWidth - 10);
                    
                    if (yPosition + (bulletLines.length * 12) > pageHeight - margin) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    
                    doc.text(bulletLines, margin + 5, yPosition);
                    yPosition += bulletLines.length * 12;
                });
                
                yPosition += 10;
            });
        }

        // Technical Skills
        if (formattedResume.skills) {
            addLine();
            addText('TECHNICAL SKILLS', 12, 'bold', [99, 102, 241]);
            
            Object.entries(formattedResume.skills).forEach(([category, skillsList]) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                
                const categoryLines = doc.splitTextToSize(`${category}:`, contentWidth);
                doc.text(categoryLines, margin, yPosition);
                yPosition += 12;
                
                doc.setFont('helvetica', 'normal');
                const skillsLines = doc.splitTextToSize(skillsList, contentWidth - 20);
                doc.text(skillsLines, margin + 10, yPosition);
                yPosition += skillsLines.length * 12 + 5;
            });
        }

        // Save the PDF
        doc.save('Zachary_Preator_Resume.pdf');

        // Reset button
        btn.innerHTML = originalHTML;
        btn.disabled = false;

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        
        // Reset button
        const btn = document.getElementById('download-resume-btn');
        btn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
        btn.disabled = false;
    }
}

function parseResumeForPDF(markdown) {
    const resume = {
        name: '',
        title: '',
        email: '',
        location: '',
        linkedin: '',
        github: '',
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: {}
    };

    // Extract name (first # heading)
    const nameMatch = markdown.match(/^# (.+)$/m);
    if (nameMatch) resume.name = nameMatch[1].trim();

    // Extract title (bold text after name, typically)
    const titleMatch = markdown.match(/\*\*(.+?)\*\*/);
    if (titleMatch) resume.title = titleMatch[1].trim();

    // Extract contact info
    const emailMatch = markdown.match(/📧.*?\[([^\]]+)\]/);
    if (emailMatch) resume.email = emailMatch[1];

    const locationMatch = markdown.match(/📍 Location: (.+)$/m);
    if (locationMatch) resume.location = locationMatch[1].trim();

    const linkedinMatch = markdown.match(/🔗.*?\[([^\]]+)\]/);
    if (linkedinMatch) resume.linkedin = linkedinMatch[1];

    const githubMatch = markdown.match(/🐙.*?\[([^\]]+)\]/);
    if (githubMatch) resume.github = githubMatch[1];

    // Extract summary
    const summaryMatch = markdown.match(/## Summary\s*\n\n(.*?)(?=\n\n## |$)/s);
    if (summaryMatch) resume.summary = summaryMatch[1].trim();

    // Extract experience
    const experienceMatch = markdown.match(/## Experience\s*\n\n(.*?)(?=\n## |$)/s);
    if (experienceMatch) {
        const expText = experienceMatch[1].trim();
        const expEntries = expText.split(/\n(?=\*\*)/);
        
        expEntries.forEach(entry => {
            const headerMatch = entry.match(/\*\*(.*?),\s*(.*?)\*\*,?\s*(.*?)\s*-\s*\*(.*?)\*/);
            if (headerMatch) {
                const bullets = [];
                const bulletMatches = entry.matchAll(/^- (.+)$/gm);
                for (const match of bulletMatches) {
                    bullets.push(match[1].replace(/\*\*/g, ''));
                }
                
                resume.experience.push({
                    company: headerMatch[1].trim(),
                    title: headerMatch[2].trim(),
                    location: headerMatch[3].trim(),
                    date: headerMatch[4].trim(),
                    bullets: bullets
                });
            }
        });
    }

    // Extract education
    const educationMatch = markdown.match(/## Education\s*\n\n(.*?)(?=\n## |$)/s);
    if (educationMatch) {
        const eduText = educationMatch[1].trim();
        const eduEntries = eduText.split(/\n(?=\*\*)/);
        
        eduEntries.forEach(entry => {
            // Match pattern: **School Name**, Location - *Date*
            const headerMatch = entry.match(/\*\*(.+?)\*\*,\s*(.+?)\s*-\s*\*(.+?)\*/);
            if (headerMatch) {
                const details = [];
                const bulletMatches = entry.matchAll(/^- (.+)$/gm);
                for (const match of bulletMatches) {
                    details.push(match[1].replace(/\*\*/g, ''));
                }
                
                // First bullet is typically the degree
                const degree = details.length > 0 ? details[0] : '';
                const otherDetails = details.slice(1);
                
                resume.education.push({
                    school: headerMatch[1].trim(),
                    degree: degree,
                    location: headerMatch[2].trim(),
                    date: headerMatch[3].trim(),
                    details: otherDetails
                });
            }
        });
    }

    // Extract projects
    const projectsMatch = markdown.match(/## Projects\s*\n\n(.*?)(?=\n## |$)/s);
    if (projectsMatch) {
        const projectsText = projectsMatch[1].trim();
        const projectEntries = projectsText.split(/\n(?=\*\*)/);
        
        projectEntries.forEach(entry => {
            // Match pattern: **Project Name** *(Status, Date)*
            const headerMatch = entry.match(/\*\*(.+?)\*\*\s*\*?\(?(.*?)\)?\.?\*?/);
            if (headerMatch) {
                const bullets = [];
                const bulletMatches = entry.matchAll(/^- (.+)$/gm);
                for (const match of bulletMatches) {
                    // Skip the Technologies line
                    if (!match[1].startsWith('**Technologies:**')) {
                        bullets.push(match[1].replace(/\*\*/g, ''));
                    }
                }
                
                resume.projects.push({
                    name: headerMatch[1].trim(),
                    date: headerMatch[2] ? headerMatch[2].trim() : '',
                    bullets: bullets
                });
            }
        });
    }

    // Extract technical skills
    const skillsMatch = markdown.match(/## Technical Skills\s*\n\n(.*?)(?=\n## |$|$)/s);
    if (skillsMatch) {
        const skillsText = skillsMatch[1].trim();
        const skillLines = skillsText.split('\n');
        
        skillLines.forEach(line => {
            const skillMatch = line.match(/\*\*(.+?):\*\*\s*(.+)/);
            if (skillMatch) {
                resume.skills[skillMatch[1].trim()] = skillMatch[2].trim();
            }
        });
    }

    return resume;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-resume-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateResumePDF);
    }
});

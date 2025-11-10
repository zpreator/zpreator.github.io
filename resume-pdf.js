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

        // Summary (no header label)
        if (formattedResume.summary) {
            addText(formattedResume.summary, 10, 'normal', [60, 60, 60]);
            yPosition += 10;
        }

        // Generic sections (Experience, Education, Projects, Technical Skills, etc.)
        formattedResume.sections.forEach(section => {
            addLine();
            addText(section.name.toUpperCase(), 12, 'bold', [99, 102, 241]);
            
            section.entries.forEach(entry => {
                // Check for page break
                if (yPosition > pageHeight - margin - 100) {
                    doc.addPage();
                    yPosition = margin;
                }
                
                if (entry.inline) {
                    // Inline format: Title: Subtitle (no separate lines)
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(60, 60, 60);
                    const inlineText = `${entry.title}: `;
                    doc.text(inlineText, margin, yPosition);
                    
                    const titleWidth = doc.getTextWidth(inlineText);
                    doc.setFont('helvetica', 'normal');
                    const subtitleLines = doc.splitTextToSize(entry.subtitle, contentWidth - titleWidth - 10);
                    doc.text(subtitleLines, margin + titleWidth, yPosition);
                    yPosition += subtitleLines.length * 12 + 5;
                } else {
                    // Standard format: Title on left, subtitle on right, bullets below
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(31, 41, 55);
                    doc.text(entry.title, margin, yPosition);
                    
                    // Subtitle (right-aligned, if present)
                    if (entry.subtitle) {
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(100, 100, 100);
                        
                        const subtitleWidth = doc.getTextWidth(entry.subtitle);
                        doc.text(entry.subtitle, pageWidth - margin - subtitleWidth, yPosition);
                    }
                    
                    yPosition += 15;
                    
                    // Bullets
                    entry.bullets.forEach(bullet => {
                        doc.setFontSize(9);
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
                }
            });
        });

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
        sections: [] // Generic sections array
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

    // Generic section parser - handles Experience, Education, Projects, Technical Skills, etc.
    const sectionRegex = /## (Experience|Education|Projects|Technical Skills)\s*\n\n(.*?)(?=\n## |$)/gs;
    let sectionMatch;
    
    while ((sectionMatch = sectionRegex.exec(markdown)) !== null) {
        const sectionName = sectionMatch[1];
        const sectionContent = sectionMatch[2].trim();
        
        const entries = [];
        const entryBlocks = sectionContent.split(/\n(?=\*\*)/);
        
        entryBlocks.forEach(block => {
            // Check if this is a single-line format (like Technical Skills)
            const singleLineMatch = block.match(/\*\*([^:]+):\*\*\s*(.+)/);
            
            if (singleLineMatch) {
                // Single line format: **Category:** items
                entries.push({
                    title: singleLineMatch[1].trim(),
                    subtitle: singleLineMatch[2].trim(),
                    bullets: [],
                    inline: true // Flag to render inline
                });
            } else {
                // Multi-line format with bullets
                // Match only the first **...** on the first line
                const lines = block.split('\n');
                const firstLine = lines[0];
                const firstLineMatch = firstLine.match(/^\*\*(.+?)\*\*(.*?)$/);
                
                if (firstLineMatch) {
                    const title = firstLineMatch[1].trim();
                    const remainder = firstLineMatch[2].trim();
                    
                    let subtitle = '';
                    
                    if (remainder) {
                        // Remove leading comma and whitespace
                        let cleaned = remainder.replace(/^,\s*/, '');
                        
                        // Extract parts wrapped in * and parts not wrapped
                        const parts = [];
                        let current = '';
                        let inAsterisk = false;
                        
                        for (let i = 0; i < cleaned.length; i++) {
                            if (cleaned[i] === '*') {
                                if (current.trim()) {
                                    parts.push(current.trim());
                                    current = '';
                                }
                                inAsterisk = !inAsterisk;
                            } else {
                                current += cleaned[i];
                            }
                        }
                        if (current.trim()) {
                            parts.push(current.trim());
                        }
                        
                        // Clean up parts - remove trailing dashes and whitespace
                        const cleanedParts = parts.map(p => p.replace(/\s*-\s*$/, '').trim()).filter(p => p);
                        
                        // Join with bullet
                        subtitle = cleanedParts.join(' • ');
                    }
                    
                    // Extract bullets
                    const bullets = [];
                    const bulletMatches = block.matchAll(/^- (.+)$/gm);
                    for (const match of bulletMatches) {
                        // Skip lines that start with **Technologies:**
                        if (!match[1].startsWith('**Technologies:**')) {
                            bullets.push(match[1].replace(/\*\*/g, ''));
                        }
                    }
                    
                    entries.push({
                        title: title,
                        subtitle: subtitle,
                        bullets: bullets,
                        inline: false
                    });
                }
            }
        });
        
        resume.sections.push({
            name: sectionName,
            entries: entries
        });
    }

    return resume;
}

function parseSkillsSection(content) {
    const skills = {};
    const skillLines = content.split('\n');
    
    skillLines.forEach(line => {
        const skillMatch = line.match(/\*\*(.+?):\*\*\s*(.+)/);
        if (skillMatch) {
            skills[skillMatch[1].trim()] = skillMatch[2].trim();
        }
    });
    
    return skills;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-resume-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateResumePDF);
    }
});

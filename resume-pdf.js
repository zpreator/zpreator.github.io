// PDF Resume Generator - Pure JavaScript
// Generates PDF from resume.md on-the-fly

import { fetchAndParseResume } from './resume-parser.js';

async function generateResumePDF() {
    try {
        // Show loading state
        const btn = document.getElementById('download-resume-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        btn.disabled = true;

        // Fetch and parse resume using common parser
        const formattedResume = await fetchAndParseResume();

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
                    // Standard format: 
                    // Title (bold) on left with subtitle (normal) right after it
                    // Sub subtitle (normal) right-aligned on same line
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(31, 41, 55);
                    
                    // Title
                    doc.text(entry.title, margin, yPosition);
                    const titleWidth = doc.getTextWidth(entry.title);
                    
                    // Subtitle (non-bold, right after title)
                    if (entry.subtitle) {
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(60, 60, 60);
                        doc.text(', ' + entry.subtitle, margin + titleWidth, yPosition);
                    }
                    
                    // Sub subtitle (right-aligned)
                    if (entry.subSubtitle) {
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(100, 100, 100);
                        
                        const subSubtitleWidth = doc.getTextWidth(entry.subSubtitle);
                        doc.text(entry.subSubtitle, pageWidth - margin - subSubtitleWidth, yPosition);
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-resume-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateResumePDF);
    }
});

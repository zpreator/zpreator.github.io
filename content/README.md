# Content Directory

This directory contains all the markdown content that powers the portfolio website. When you update these files, the website will automatically reflect the changes.

## Structure

- **about.md** - The "About Me" section content
- **projects/** - Individual project markdown files
  - Each project has its own `.md` file with structured content

## Project File Format

Each project markdown file should follow this structure:

```markdown
# Project Title

## Description
Brief one-paragraph description (used in project card)

## Details
- Bullet point 1
- Bullet point 2

## Technologies
Comma-separated list of technologies

## Links
- link_type: url (e.g., github: https://github.com/..., demo: ./path/to/demo, website: https://...)

## Image
filename.jpg (located in images/projects/)

## Status
Active/Complete/Prototype

## Year
2024 or 2023-2025
```

## How It Works

The website automatically:
1. Loads the summary from `resume.md` for the hero section
2. Loads about content from `content/about.md`
3. Scans `content/projects/` for all `.md` files and generates project cards
4. Replaces `{YEARS}` placeholder with calculated years of experience

## Updating Content

Just edit the relevant markdown file and refresh the website - no need to touch HTML or JavaScript!

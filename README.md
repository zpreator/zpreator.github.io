# zpreator.github.io

Personal portfolio: https://zpreator.github.io

Plain static site, no build step and no JavaScript.

- `index.html` / `style.css`: the whole site. To add a site or project, copy an existing block in `index.html`.
- `images/site/`: screenshots for the "Sites I run" tiles. `images/projects/`: project thumbnails.
- `cachecow/`: download page for CacheCow (has its own `styles.css`).
- `resume.md`: source of truth for the resume. `resume.pdf` is generated from it.

## Resume PDF

Edit `resume.md` (layout lives in `resume.css`) and push. The GitHub Action in `.github/workflows/resume.yml` rebuilds and commits `resume.pdf`.

To build locally (needs `pandoc` and Chrome):

```bash
./build-resume.sh
```

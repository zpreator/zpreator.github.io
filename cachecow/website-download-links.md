# Website Download Links for CacheCow Releases

## How GitHub Release URLs Work

GitHub provides two URL patterns for release assets:

### Latest release (always current)
```
https://github.com/{owner}/{repo}/releases/latest/download/{filename}
```

### Specific version
```
https://github.com/{owner}/{repo}/releases/download/{tag}/{filename}
```

---

## Problem: Version Numbers in Filenames

Tauri names installer files with the version number baked in (e.g. `CacheCow_1.2.0_aarch64.dmg`), so the filename changes with every release. The `/releases/latest/download/` redirect only works if the filename is **stable across versions**.

**Solution:** Use the GitHub API to dynamically resolve asset URLs, or use only the files with stable filenames (the install script).

---

## Files with Stable Filenames (Static Links Work)

These filenames never change between releases — static links work directly:

| Platform | URL |
|----------|-----|
| Linux (install script) | `https://github.com/zpreator/CacheCow/releases/latest/download/install.sh` |

---

## Files with Version-Numbered Filenames (Dynamic Links Required)

| Platform | Filename pattern |
|----------|-----------------|
| macOS Apple Silicon | `CacheCow_{version}_aarch64.dmg` |
| Windows | `CacheCow_{version}_x64-setup.exe` |

For these, use the GitHub API to look up the actual URL at page load time.

---

## Option A — JavaScript (Dynamic, Recommended)

Fetch the latest release from the GitHub API and populate download buttons automatically. Works for any static site (GitHub Pages, Netlify, etc.).

```html
<a id="btn-mac" href="#" hidden>Download for macOS</a>
<a id="btn-windows" href="#" hidden>Download for Windows</a>
<a id="btn-linux" href="#">Install on Linux (server)</a>

<script>
  const REPO = "zpreator/CacheCow";

  fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
    .then(r => r.json())
    .then(release => {
      for (const asset of release.assets) {
        if (asset.name.endsWith("_aarch64.dmg")) {
          const btn = document.getElementById("btn-mac");
          btn.href = asset.browser_download_url;
          btn.removeAttribute("hidden");
        }
        if (asset.name.endsWith("_x64-setup.exe")) {
          const btn = document.getElementById("btn-windows");
          btn.href = asset.browser_download_url;
          btn.removeAttribute("hidden");
        }
      }
    });
</script>
```

The Linux button can always be a static link since `install.sh` has a stable filename:
```html
<a href="https://github.com/zpreator/CacheCow/releases/latest/download/install.sh">
  Install on Linux (server)
</a>
```

---

## Option B — Hardcoded Links (Manual Update Required)

If you prefer not to use JavaScript, hardcode the links and update them after each release.

```html
<!-- Update the version number after each release -->
<a href="https://github.com/zpreator/CacheCow/releases/download/v1.0.0/CacheCow_1.0.0_aarch64.dmg">
  Download for macOS
</a>
<a href="https://github.com/zpreator/CacheCow/releases/download/v1.0.0/CacheCow_1.0.0_x64-setup.exe">
  Download for Windows
</a>
<a href="https://github.com/zpreator/CacheCow/releases/latest/download/install.sh">
  Install on Linux (server)
</a>
```

---

## Linking to a Specific Version

Replace `latest` with the tag name, and use the exact versioned filename:

```
https://github.com/zpreator/CacheCow/releases/download/v1.2.0/CacheCow_1.2.0_aarch64.dmg
https://github.com/zpreator/CacheCow/releases/download/v1.2.0/CacheCow_1.2.0_x64-setup.exe
https://github.com/zpreator/CacheCow/releases/download/v1.2.0/install.sh
```

---

## Linux Install Command

Show this as a code block on your website for Linux/server users:

```bash
curl -sSL https://github.com/zpreator/CacheCow/releases/latest/download/install.sh | bash
```

---

## GitHub API Rate Limits

The unauthenticated API allows **60 requests/hour per IP**. For a personal portfolio site this is more than sufficient. If traffic grows, authenticate requests using a read-only personal access token.

---

## Releases Page

Always a good fallback link — shows all versions with all assets:
```
https://github.com/zpreator/CacheCow/releases
```

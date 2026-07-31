# dmitsot.github.io

Personal academic website of Dimitrios Mitsotakis, migrated off Google Sites.
Plain HTML and CSS — no build step, no dependencies, no JavaScript framework.

## Publishing on GitHub Pages

1. Create a repository named `dmitsot.github.io` (a user site — it will be served
   from `https://dmitsot.github.io`). Any other repo name works too; the site
   then lives at `https://dmitsot.github.io/<repo-name>/`.
2. Push the contents of this folder to the `main` branch.
3. In the repository, go to **Settings → Pages** and set **Source** to
   *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. The site is live a minute or so later.

```bash
cd dmitsot-site
git init
git add .
git commit -m "Initial import from Google Sites"
git branch -M main
git remote add origin git@github.com:dmitsot/dmitsot.github.io.git
git push -u origin main
```

To preview locally before pushing:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Images

All images have been downloaded into `assets/images/` and every `<img>` on every
page resolves. Nothing further is needed here.

They were fetched with [`tools/download-assets.js`](tools/download-assets.js),
which is kept in the repo in case a page ever needs re-importing. Note that it
counts the VUW / GitHub / ResearchGate logo buttons as content images, so its
numbering runs one ahead on the About page; the files in `assets/images/` have
already been renamed to match the HTML.

| File | Used on |
| --- | --- |
| `about-portrait.jpg` | `index.html` |
| `about-poseidon.png`, `about-01.png` … `about-07.png` | `index.html` — POSEIDON meshes and solutions |
| `wave-euler-equations.png`, `wave-phenomena-figure.png` | `wave-phenomena.html` |
| `gallery-unstructured-grid.png` | `gallery.html` |
| `teaching.png` | `teaching.html` |
| `computational-mathematics-cover.png` | `computational-mathematics.html` |
| `academic-genealogy.png` | `academic-genealogy.html` |
| `tsunamis-01.png` … `tsunamis-04.png` | `software-tsunamis.html` |

Three files are downloaded but unused, since the corresponding links are plain
text in the redesign: `about-vuw-logo.png`, `about-github.png` and
`about-researchgate.png`. Delete them or use them, as you prefer.

Several files carry a `.png` extension but are really JPEGs — that is how they
were stored on Google Sites. Browsers sniff the content type, so they display
correctly; rename them if it bothers you.

**Keep the Google Site up until you have confirmed this repo looks right.** Once
it is deleted the original CDN URLs stop resolving.

## Things to check

**Equations.** Every equation on `wave-phenomena.html` is MathJax rather than an
image. They fall into three groups:

1. *Transcribed from the original image.* The Euler system was read off
   `assets/images/wave-euler-equations.png`, which is kept in `assets/images/`
   for comparison. One correction was made: the image gave the kinematic
   free-surface condition as \(\eta_t + \mathbf{u}\cdot\nabla\eta = 0\), which
   was an error in the original; it now reads \(= w\). Verified 2026.
2. *Standard forms, reconstructed.* KdV, BBM and Peregrine — their images had
   already stopped rendering on the live Google Site, so these are the standard
   published forms rather than transcriptions. Still worth checking against your
   own notation and normalisation. The two displayed equations on
   `software.html` (complex-step Newton) are in the same category.
3. *Supplied directly.* The regularised, energy-conserving system from [KMS] and
   its coefficients were provided by the author and are typeset verbatim.

The MathJax config defines `\Div`, `\bu`, `\bx` and `\bn` as macros, so LaTeX
using those shorthands can be pasted in unchanged.

MathJax is loaded from a CDN on this page and on `software-cs-newton.html` only.

**PDFs.** Every PDF on the old site was linked to arXiv, HAL, ResearchGate or a
publisher rather than uploaded to Google Sites, so nothing needed downloading —
all those links point at their original hosts and were carried over unchanged.

## Layout

```
index.html                      About me (home)
wave-phenomena.html
gallery.html                    Gallery of Waves
publications.html
research.html
teaching.html
computational-mathematics.html
software-tsunamis.html
software-cs-newton.html
academic-genealogy.html
404.html
assets/css/style.css            The only stylesheet
assets/images/                  Populate with tools/download-assets.js
tools/download-assets.js        Browser-console asset fetcher
.nojekyll                       Serve files as-is, skip Jekyll
```

## Editing

Each page is a self-contained HTML file — open it, edit the prose, save. The
header, navigation and footer are duplicated across the files on purpose, so
there is nothing to install and nothing to build.

If you would rather not hand-edit the shared header in ten places, the original
generator is included in the parent folder: `bodies/<page>.html` holds just the
`<main>` content of each page and `build.py` wraps it in the shared chrome.

```bash
python3 build.py     # regenerates every page except index.html
```

`index.html` is maintained by hand.

## Design

Serif reading column (Iowan Old Style / Palatino, falling back to Georgia) beside
a fixed navy sidebar holding the navigation. Below 720px the sidebar becomes a
bar at the top with a Menu button.

Everything is driven by CSS custom properties at the top of
`assets/css/style.css`. The ones you are most likely to touch:

| Variable | Controls |
| --- | --- |
| `--sidebar-bg`, `--sidebar-bg-deep` | Sidebar gradient — set both the same for a flat color |
| `--sidebar-ink`, `--sidebar-strong` | Sidebar text and its active/hover state |
| `--sidebar-w` | Sidebar width (16.5rem) |
| `--accent` | Link color in the content column |
| `--measure` | Width of the reading column (42rem) |

For a pale sidebar instead of the navy one, set `--sidebar-bg` and
`--sidebar-bg-deep` to `#eef2f6`, `--sidebar-ink` to `#4a5158` and
`--sidebar-strong` to `#12385a`.

## Notes

- The old site's Google Sites search box has no equivalent here. If you want
  search, the simplest option is a small client-side index; happy to add one.
- YouTube videos on the gallery page are embedded with `loading="lazy"`, so they
  only load when scrolled into view.
- MathJax is loaded from a CDN, and only on the two pages that need it.
- The stylesheet includes a print style: pages print without the navigation.

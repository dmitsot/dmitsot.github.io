# dmitsotakis.com

Source for the personal academic website of Dimitrios Mitsotakis, Associate
Professor in the School of Mathematics and Statistics, Victoria University of
Wellington.

**Live site:** <https://www.dmitsotakis.com>

Static HTML and CSS — no build step, no dependencies, no JavaScript framework.
Served by GitHub Pages from the `main` branch.

## Running locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

```
*.html              one file per page
assets/css/         the stylesheet
assets/images/      figures and photographs
assets/files/       downloadable documents
```

MathJax is loaded from a CDN on the two pages that display equations.

## Copyright

© Dimitrios Mitsotakis. The written content, figures and photographs are all
rights reserved. Third-party logos are the property of their respective owners.

PDFs linked from this site are preprint versions and may differ from the
published articles.

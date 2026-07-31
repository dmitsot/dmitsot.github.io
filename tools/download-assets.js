/* ---------------------------------------------------------------------------
 * download-assets.js
 *
 * Downloads every image still hosted on Google's CDN by the old Google Site and
 * saves it under the exact filename this repo's HTML expects.
 *
 * The images live on lh3.googleusercontent.com behind short-lived tokens, so
 * they have to be fetched from a browser that is logged in / has the pages in
 * its cache. Command-line tools (curl, wget) generally get blocked.
 *
 * HOW TO RUN
 *   1. Open https://sites.google.com/view/dmitsot/ in Chrome.
 *   2. Open DevTools (Cmd+Option+I) and pick the Console tab.
 *   3. Paste this whole file in and press Enter.
 *   4. Chrome will ask to allow multiple downloads — allow it.
 *   5. Move everything from ~/Downloads into assets/images/ in this repo.
 *
 * Files that fail are listed at the end so you can grab them by hand.
 * ------------------------------------------------------------------------- */

(async () => {
  const BASE = 'https://sites.google.com/view/dmitsot/';

  // page slug -> how to name the images found on that page.
  //   names:  fixed filenames, applied in DOM order
  //   prefix: leftovers become <prefix>-01, <prefix>-02, ...
  const PLAN = [
    { slug: 'about-me',
      names: ['about-portrait.jpg'],
      byAlt: { POSEIDON: 'about-poseidon.png' },
      prefix: 'about' },

    { slug: 'wave-phenomena',
      names: ['wave-euler-equations.png', 'wave-phenomena-figure.png'] },

    { slug: 'wave-phenomena/wavephenomena',
      names: ['gallery-unstructured-grid.png'] },

    { slug: 'teaching',
      names: ['teaching.png'] },

    { slug: 'computational-mathematics',
      names: ['computational-mathematics-cover.png'] },

    { slug: 'academic-genealogy',
      names: ['academic-genealogy.png'] },

    { slug: 'software/tsunamis',
      prefix: 'tsunamis' },

    // 'research' and 'software/cs-newton-method' have no images of their own.
  ];

  const MIN_PIXELS = 60;      // skip icons, buttons and tracking pixels
  const PAUSE_MS   = 400;     // be gentle; Chrome throttles rapid downloads

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const failures = [];
  let saved = 0;

  /** Pull the image URLs out of one page, in document order. */
  async function imagesOn(slug) {
    const html = await fetch(BASE + slug, { credentials: 'omit' }).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');

    return [...doc.querySelectorAll('img')]
      .map((img) => ({
        url: (img.getAttribute('src') || '').split('=w')[0],
        alt: img.getAttribute('alt') || '',
        w: parseInt(img.getAttribute('width') || '0', 10),
        h: parseInt(img.getAttribute('height') || '0', 10),
      }))
      .filter((i) => i.url.includes('googleusercontent'))
      // drop obvious icons / 1x1 trackers when the page declares a size
      .filter((i) => !(i.w && i.w < MIN_PIXELS) && !(i.h && i.h < MIN_PIXELS));
  }

  /** Fetch one image and hand it to the browser as a download. */
  async function save(url, filename) {
    try {
      const res = await fetch(url + '=w2000', { credentials: 'omit' });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);

      saved++;
      console.log('  saved  ' + filename);
    } catch (err) {
      failures.push({ filename, url, reason: String(err) });
      console.warn('  FAILED ' + filename + ' — ' + err);
    }
  }

  for (const page of PLAN) {
    console.log('\n' + page.slug);
    const found = await imagesOn(page.slug);

    if (!found.length) {
      console.log('  (no images found)');
      continue;
    }

    const fixed = [...(page.names || [])];
    let n = 0;

    for (const img of found) {
      let filename = null;

      // 1. filename keyed off the alt text, if one was configured
      for (const [needle, name] of Object.entries(page.byAlt || {})) {
        if (img.alt.includes(needle)) { filename = name; break; }
      }
      // 2. otherwise take the next fixed name
      if (!filename && fixed.length) filename = fixed.shift();
      // 3. otherwise fall back to the numbered prefix
      if (!filename && page.prefix) {
        n++;
        filename = page.prefix + '-' + String(n).padStart(2, '0') + '.png';
      }
      if (!filename) continue;   // more images than the plan accounts for

      await save(img.url, filename);
      await sleep(PAUSE_MS);
    }
  }

  console.log('\n---------------------------------------------');
  console.log(saved + ' file(s) downloaded to your Downloads folder.');
  console.log('Move them into assets/images/ in the repo.');

  if (failures.length) {
    console.log('\n' + failures.length + ' file(s) failed — save these by hand:');
    console.table(failures);
  }
})();

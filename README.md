# Sarah Bahashwan — Portfolio (v3)

A single-page portfolio. Deep navy, warm cream, forest green, quiet gold. Mature, confident, recruiter-ready.

## File layout

```
portfolio-v3/
├── index.html         · structure & content
├── style.css          · design system, layout, animations
├── script.js          · gradient, typer, observers, lightbox
└── assets/
    └── certs/
        └── kaust-intro.jpg   · your real KAUST certificate (already bundled)
```

No frameworks. No build step.

---

## Run it locally

```bash
python3 -m http.server 5500
```

Open `http://localhost:5500`. Or just double-click `index.html`.

## Deploy to GitHub Pages

Same as your current `My_CV` site:

1. Push the contents of `portfolio-v3/` to your repo.
2. In repo **Settings → Pages**, set the branch to `main`, folder to `/ (root)`.
3. Done — live in ~1 minute.

---

## What changed from v2 (the playful pink/teal version)

### 1. Mature palette
Pink/lavender/teal replaced with **deep navy + warm cream + forest green + quiet gold**. No more candy. It now reads the way a senior portfolio should — Bloomberg / Stripe / FT confidence.

### 2. Real certificate images
The certificates section now supports two formats: **real scans** with a caption that slides up on hover, or a **dark fallback card** for ones you haven't scanned yet. The KAUST cybersecurity scan is already bundled. See "How to add more certificate images" below.

### 3. Project click bug fixed
Project cards were `<a href="#">` in v2 — that's why clicking jumped you to the top. They're now `<article>` elements that don't navigate at all. If you want a project card to link to a GitHub repo or live demo, set `data-href="…"` on the article (see "How to link projects to GitHub" below).

---

## How to add more certificate images

1. **Save your scan** as a JPG or PNG into `assets/certs/`. Recommended:
   - Landscape orientation (4:3 or 3:2 looks best in the grid)
   - ~1200 px wide
   - Filename: lowercase with hyphens (e.g. `ceh.jpg`, `microsoft.jpg`)

2. **In `index.html`**, find the cert button for that certificate. Right now they look like this (text-only fallback):

   ```html
   <button class="cert" type="button"
           data-cert-image="assets/certs/ceh.jpg"
           data-cert-issuer="EC-Council · MCIT"
           data-cert-name="Certified Ethical Hacker"
           data-cert-date="2024">
     <div class="cert__face">
       <span class="cert__issuer">EC-Council · MCIT</span>
       <span class="cert__name">Certified Ethical Hacker</span>
       <span class="cert__date">2024</span>
     </div>
   </button>
   ```

3. **Replace the `<div class="cert__face">` block** with this (mirrors the KAUST card already in the file):

   ```html
   <button class="cert" type="button"
           data-cert-image="assets/certs/ceh.jpg"
           data-cert-issuer="EC-Council · MCIT"
           data-cert-name="Certified Ethical Hacker"
           data-cert-date="2024">
     <img class="cert__img" src="assets/certs/ceh.jpg" alt="EC-Council — Certified Ethical Hacker"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
     <div class="cert__face" style="display:none">
       <span class="cert__issuer">EC-Council · MCIT</span>
       <span class="cert__name">Certified Ethical Hacker</span>
       <span class="cert__date">2024</span>
     </div>
     <div class="cert__caption">
       <span class="cert__issuer">EC-Council · MCIT</span>
       <span class="cert__name">Certified Ethical Hacker</span>
       <span class="cert__date">2024</span>
     </div>
   </button>
   ```

The KAUST card already has this structure — copy-paste from it as a template.

**Why the `onerror` line?** If the image file is missing or fails to load, the card automatically falls back to the dark navy text version. So you never get a broken-image icon.

**Lightbox** — clicking the card opens the full image in a centered lightbox with the caption below. Press Esc or click outside to close.

---

## How to link projects to GitHub or live demos

Right now project cards don't navigate when clicked (this fixed the "jumps to top" bug). To make one open a repo or live site:

```html
<!-- Before: doesn't link -->
<article class="project" data-key="noor">

<!-- After: clicking opens the URL in a new tab -->
<article class="project" data-key="noor" data-href="https://github.com/SarahBahash/noor-altariq">
```

Add `data-href="..."` to any `<article class="project">` in `index.html`. The cursor changes to a pointer automatically, and clicks open in a new tab.

---

## The design system (in case you want to tweak colors)

All tokens live in `style.css` at the top:

| Variable        | Value      | What it's used for                  |
| --------------- | ---------- | ----------------------------------- |
| `--paper`       | `#F5F1EA`  | Background (warm cream)             |
| `--paper-warm`  | `#EDE7DC`  | Alt section background              |
| `--ink`         | `#0E1B2E`  | Primary text + dark buttons         |
| `--forest`      | `#1F4D3A`  | Eyebrows, links, italic accents     |
| `--gold`        | `#B08641`  | The quiet gold — used sparingly     |

Change `--gold` to something else (a deeper amber, a dusty rose, a slate blue) and the whole site's accent shifts in one move. The forest and navy stay — they're the structural color.

---

## What lives inside (every interactive bit)

- **Backdrop gradient** — soft navy/forest/gold blobs drifting at low opacity. GPU-only, pauses when the tab is hidden.
- **Typing tagline** — cycles four phrases about what you're doing now. Edit them at the top of `script.js` (`phrases` array).
- **Jeddah clock** — live local time in the hero meta row.
- **Card cursor highlight** — experience cards get a soft forest-green glow that follows your cursor.
- **Skill ↔ project linking** — hover a skill chip and the projects that used it light up.
- **Project cards** — hover slides the title to forest green and the arrow drifts up-right. Click does nothing unless `data-href` is set (see above).
- **Certificate wall** — image or fallback card, hover reveals caption, click opens lightbox.
- **Footer easter egg** — tap the small gold dot for a rotating thank-you message.

---

## Notes on the writing

The copy is in your voice but tuned for recruiters. Headlines use Instrument Serif (the italic moments — *"introduction"*, *"Cybersecurity"*, *"Credentials"* — are intentional accents, not decoration). Body copy in General Sans. Labels in JetBrains Mono.

If a section's tone ever feels wrong, every paragraph is in plain HTML in `index.html` — find the section, edit the text, refresh.

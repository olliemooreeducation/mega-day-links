# MEGA Day Links

A standalone static page per MEGA day — the websites (and eventually local HTML tools) a coach needs open on a shared screen or station laptop, grouped by time slot so nobody's typing URLs out loud. `index.html` is a master page linking to each day's folder. Each year group has its own folder with its own `index.html` (the links page) plus any tools or resources for that day.

## Putting it on GitHub Pages

1. Create a repo (or use an existing one) and add these files to the root — keep `assets/` and each day's `.html` file exactly as they are.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a URL like `https://<your-org>.github.io/<repo-name>/` — the master page is the site root, Y11 is `.../y11-qubit-by-qubit.html` and Y7/8 is `.../y7-8-circuit-signal.html`. Bookmark that directly on station laptops.
4. Pages takes a minute or two to go live after each push.

## Adding another MEGA day

1. Copy `y11-qubit-by-qubit.html` to a new file at the root, e.g. `y7-mega-mania.html`.
2. Update the `<title>`, the eyebrow/heading text, and replace each `.block` with that day's own time slots and links.
   - A clickable website link: use the `link-card clickable` pattern with a real `href`.
   - Something with no link (physical kit, an installed app, a **local HTML file** you've built for that day): use the `link-card disabled` pattern — add a `pill physical` or `pill installed` tag, or just drop the note. For a local HTML file that lives in this same repo, point `href` at its path and use `link-card clickable` instead, since it's an actual link.
3. Commit and push — Pages rebuilds automatically.

## Editing colours / branding

Everything lives in `assets/style.css` as CSS variables at the top (`--navy`, `--pink`, `--orange`, etc.) — change them once and every page updates. The MEGA logo is `assets/mega-logo.png` (white wordmark, transparent background — built for the dark navy pages here).

## Adding a day to the master page

Add a new `.block` to `index.html` with a card for the day's page and a card for each tool page it ships with.

## Mystery Gate worksheet

`y10/mystery-gate.html` is the interactive Mystery Gate worksheet (now used on the Y10 day). It is a standalone page, so it can be linked or embedded in an iframe (`<iframe src="mystery-gate.html" style="width:100%;height:1500px;border:0">`); it hides the logo when embedded. Students' answers are saved in their own browser only, and the Print button gives a PDF copy.

## Folder structure

```
index.html            master page - one big button per day
assets/               shared style.css and logo
y7-8/                 Year 7 & 8 - Frontier Explorers (links page, Radio Challenge, extensions)
  index.html          redirects home for now
  mystery-gate.html   redirect to y10/ (delete once old guide/deck links are updated)
  radio-mini-projects.html   redirect to y10/ (same)
y10/                  Year 10 - Circuit & Signal
  index.html          links page  (y10/index.html)
  mystery-gate.html
  radio-mini-projects.html
y11/                  Year 11 - Qubit by Qubit
  index.html          links page  (y11/index.html)
  briefcase.html
  hackathon-landing.html
  Quirk-E-Teleportation-Guide.pdf
```


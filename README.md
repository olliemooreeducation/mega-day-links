# MEGA & TechFirst Day Links

Static links pages for event days, split into two regions:

- **`index.html`** (site root): chooser with two big boxes, MEGA and TechFirst.
- **`mega/`**: the MEGA site. One folder per year group, each with its own `index.html` links page plus any tools for that day. `mega/index.html` is the MEGA master page.
- **`techfirst/`**: the TechFirst site. Placeholder ("Under construction") until activities and links are added.

The **Feedback** button (top right of each page) goes to a different form per region:

- MEGA pages: `https://forms.fillout.com/t/1YQ9vJsVrXus`
- TechFirst pages: `https://forms.fillout.com/t/4dPNqbRsbZus`

**Old addresses still work.** The MEGA pages used to live at the root (`y7-8/`, `y10/` and so on). Each old `.html` path now holds a tiny redirect page that forwards to the same page under `mega/`, so bookmarks, QR codes and slide links keep working. Point new links at `mega/...` directly.

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

MEGA styles live in `mega/assets/style.css` as CSS variables at the top (`--navy`, `--pink`, `--orange`, etc.) — change them once and every page updates. The MEGA logo is `mega/assets/mega-logo.png` (white wordmark, transparent background — built for the dark navy pages here).

## Adding a day to the master page

Add a new `.block` to `mega/index.html` with a card for the day's page and a card for each tool page it ships with.

## Mystery Gate worksheet

`mega/y10/mystery-gate.html` is the interactive Mystery Gate worksheet (now used on the Y10 day). It is a standalone page, so it can be linked or embedded in an iframe (`<iframe src="mystery-gate.html" style="width:100%;height:1500px;border:0">`); it hides the logo when embedded. Students' answers are saved in their own browser only, and the Print button gives a PDF copy.

## Folder structure

```
index.html              chooser: MEGA or TechFirst
assets/                 logos for the chooser and TechFirst pages (mega-logo.png, techfirst-logo.svg)
mega/
  index.html            MEGA master page - one big button per day
  assets/               MEGA style.css and logo
  y7-8/                 Year 7 & 8 - Frontier Explorers (links page, Radio Challenge, extensions, Biotech Lab, videos)
  y9/                   Year 9 - AI-pprentice (links page, arrival desk cards)
  y10/                  Year 10 - Circuit & Signal (links page, Mystery Gate, Radio Challenge)
  y11/                  Year 11 - Qubit by Qubit (links page, briefcase, hackathon landing, Quirk-E guide PDF)
  staff/                staff-only pages
techfirst/
  index.html            TechFirst links page (under construction)
y7-8/ y9/ y10/ y11/ staff/   redirect pages only: forward old addresses to mega/
```

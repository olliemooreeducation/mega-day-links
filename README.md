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

The whole site uses **TechFirst branding** (guide dated June 2026): Roboto, deep purple `#4E259E`, bright purple `#7147DC`, teal `#0C6382`, cyan `#5ED1DD`, ice `#9EEEF2`, light background `#F5F6F8`, text `#18191C`, secondary text `#64666D`.

- **Shared styles:** `mega/assets/style.css`. Light page for easy reading on screens and projectors, with a purple header band (top bar + hero) and a cyan stripe underneath. The TechFirst links page uses the same stylesheet.
- **Cyan is never used for text on white** (contrast 1.8:1). Use it for bars, borders and fills, and give text teal or purple instead. Blocks that use `--accent: var(--pink)` (cyan) also set `--accent-ink`.
- **Activity accents:** `--lightblue` = teal, `--orange` = bright purple, `--purple` = deep purple, `--pink` = cyan. The old names are kept so existing pages did not need restructuring.
- **Pages with their own styles** (Mystery Gate, both Radio Challenge pages, Radio Extensions, Y9 arrival cards, staff page) use the same light TechFirst colours.
- **Y11 briefcase and hackathon page** keep a dark, game-style look, recoloured in TechFirst deep purple, cyan and ice.
- **Biotech Lab** (`mega/y7-8/biotech-lab.html`) still has its original cosmic game style.
- MEGA pages keep the white MEGA logo (`mega/assets/mega-logo.png`) on the purple band. The TechFirst logo is `assets/techfirst-logo.svg`.

## Adding a day to the master page

Add a new `.block` to `mega/index.html` with a card for the day's page and a card for each tool page it ships with.

## Mystery Gate worksheet

`mega/y10/mystery-gate.html` is the interactive Mystery Gate worksheet (now used on the Y10 day). It is a standalone page, so it can be linked or embedded in an iframe (`<iframe src="mystery-gate.html" style="width:100%;height:1500px;border:0">`); it hides the logo when embedded. Students' answers are saved in their own browser only, and the Print button gives a PDF copy.

## Y9 digital team planning sheet

`mega/y9/plan-1-big-ideas.html`, `plan-2-rapid-prototyping.html` and `plan-3-brand-prepare-pitch.html` replace the A1 team planning sheet. They share `planner.css` and `planner.js`.

- **Saves as you type** in the browser's local storage (keys start `mega9plan:`), so a closed tab, refresh or crash loses nothing. One laptop per team: work does not move between laptops.
- **Sketch pad** (Session 1): two sketches, saved the same way, downloadable as PNG for slide 5.
- **Twist wheel** (Session 1, `twist-wheel.js`): 30 twists, one spin per team. The result is saved before the wheel moves, so refreshing cannot re-roll. A respin needs a written reason (20+ characters) and the facilitator password; each respin is logged under the twist (old twist, new twist, reason, time). The password is stored as a hash (`PASS_HASH`), so change it by replacing that value.
- **Copy buttons** on each box copy the text ready to paste into the Canva slide the SLIDE tag points to.
- **Progress** bars, ticks and confetti when a box, page or STOP & CHECK is complete. Session 3 has a 2-minute rehearsal timer (6 slides x 20 seconds).
- **Staff reset:** "Staff: clear this laptop for a new team" at the bottom of each page deletes all three sessions from that laptop (asks twice).

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

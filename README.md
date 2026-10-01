# MEGA Day Links

A standalone static page per MEGA day — the websites (and eventually local HTML tools) a coach needs open on a shared screen or station laptop, grouped by time slot so nobody's typing URLs out loud. Each day is its own page with its own URL, rather than sitting behind a shared hub.

## Putting it on GitHub Pages

1. Create a repo (or use an existing one) and add these files to the root — keep `assets/` and each day's `.html` file exactly as they are.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a URL like `https://<your-org>.github.io/<repo-name>/` — the Y11 day lives at `.../y11-qubit-by-qubit.html`. Bookmark that directly on station laptops.
4. Pages takes a minute or two to go live after each push.

## Adding another MEGA day

1. Copy `y11-qubit-by-qubit.html` to a new file at the root, e.g. `y7-mega-mania.html`.
2. Update the `<title>`, the eyebrow/heading text, and replace each `.block` with that day's own time slots and links.
   - A clickable website link: use the `link-card clickable` pattern with a real `href`.
   - Something with no link (physical kit, an installed app, a **local HTML file** you've built for that day): use the `link-card disabled` pattern — add a `pill physical` or `pill installed` tag, or just drop the note. For a local HTML file that lives in this same repo, point `href` at its path and use `link-card clickable` instead, since it's an actual link.
3. Commit and push — Pages rebuilds automatically.

## Editing colours / branding

Everything lives in `assets/style.css` as CSS variables at the top (`--navy`, `--pink`, `--orange`, etc.) — change them once and every page updates. The MEGA logo is `assets/mega-logo.png` (white wordmark, transparent background — built for the dark navy pages here).

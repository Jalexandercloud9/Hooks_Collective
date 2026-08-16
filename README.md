# The Hooks Collective

Single-page marketing site for Allana Jackson, LPC.
Vanilla HTML/CSS/JS — no build step, no dependencies.

## Structure
```
index.html        all content
css/styles.css    all styles (color tokens at top)
js/main.js        nav, scroll reveal, form
assets/           photos (see assets/README.md)
netlify.toml      deploy config
```

## Local preview
```
npm start          # or: python3 -m http.server 8000
```

## Changing the palette
Edit the four CUSTOMIZE values at the top of `css/styles.css`.

Option B — Deep Teal & Gold: `#1F5F5B` / `#185450` / `#C9A227` / `#16302F`
Option C — Navy & Gold:      `#1B2A4A` / `#142038` / `#C9A227` / `#10182B`

## Form
Posts to Netlify Forms (form name: `inquiry`). After the first deploy, set the
notification email in Netlify: Forms > Notifications > Add notification.

## Before launch
- [ ] Real photos in `assets/`
- [ ] Confirm palette with Allana
- [ ] Register domain, update `og:url` in index.html
- [ ] Set up professional email, replace `hello@thehookscollective.com` (2 places: index.html, js/main.js)
- [ ] Confirm the crisis-line disclaimer wording
- [ ] Add social links in the footer, or delete the block

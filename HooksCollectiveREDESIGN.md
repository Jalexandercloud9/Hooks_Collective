# The Hooks Collective — Redesign Spec

Rebuild the site as **four separate pages** with a new visual identity, replacing
the current single-page plum/clay design. Reference mockups approved by the client.

Stack is unchanged: vanilla HTML/CSS/JS, no framework, no build step, no dependencies.

---

## 1. File Structure

```
index.html          HOME
about.html          ABOUT
services.html       SERVICES
contact.html        CONTACT
css/styles.css      shared stylesheet
js/main.js          shared script
assets/             images
netlify.toml
```

The header and footer are duplicated in all four HTML files. There is no build step
and no templating, so **any change to the nav or footer must be made in all four
files.** Keep the markup byte-identical between pages except for the `.active` class
on the current nav link.

---

## 2. Design Tokens

Replace the existing `:root` block entirely.

```css
:root {
  --cream: #FAF4EF;        /* page background */
  --cream-deep: #F3EAE2;   /* alternating band background */
  --white: #FFFFFF;        /* card background */
  --ink: #141414;          /* headings, primary text */
  --body: #443F3B;         /* body copy */
  --muted: #6B645E;        /* captions, meta */
  --gold: #C4873D;         /* accent: rules, icons, script, active nav */
  --gold-deep: #A96F2C;    /* gold hover */
  --border: #E5D9CE;
  --black-band: #101010;   /* CTA banner background */

  --container-max: 1200px;
  --radius: 8px;
  --radius-lg: 16px;       /* portrait images */
  --shadow-card: 0 2px 12px rgba(20, 20, 20, 0.05);
}
```

### Typography

Google Fonts, one request:

```
Oswald:wght@500;600;700
Poppins:wght@300;400;500;600
Playfair+Display:ital@1
Sacramento
```

| Token | Family | Used for |
|---|---|---|
| `--font-display` | Oswald | All headings. **Always uppercase**, `letter-spacing: -0.005em` |
| `--font-body` | Poppins | Body copy, nav, buttons. Weight 300 for paragraphs |
| `--font-script` | Sacramento | Logo wordmark, and the "Meet" / "Our" prefixes on About |
| `--font-italic` | Playfair Display italic | Gold italic accent lines only |

Scale:
- Page title (SERVICES, ABOUT): `clamp(3rem, 8vw, 5.25rem)`, Oswald 700, line-height 0.95
- Hero title: `clamp(2.75rem, 7vw, 4.75rem)`, Oswald 700, line-height 1.0
- Card heading: `1.5rem`, Oswald 600
- Body: `0.95rem`, Poppins 300, line-height 1.75
- Nav link: `0.8rem`, Poppins 500, uppercase, `letter-spacing: 0.12em`

**Gold rule:** a 3px × 56px gold bar sits under every page title and section heading,
with `margin-top: 1.25rem`.

---

## 3. Shared Components

### Logo

Left side of the header, three parts:
1. A circle: 56px, `border: 1.5px solid var(--ink)`, transparent fill, containing a
   serif capital **H** in `--ink` at ~1.6rem.
2. To its right, stacked: **"The Hooks"** in Sacramento at ~1.9rem, and directly
   below, **"COLLECTIVE"** in Poppins 500, `0.7rem`, `letter-spacing: 0.32em`.
3. The word COLLECTIVE should optically align to the width of "The Hooks" above it.

### Header / Nav

- Transparent over the cream background, no border, no shadow.
- Padding `1.75rem 0`. Logo left, links right.
- Links: HOME · ABOUT · SERVICES · CONTACT, uppercase, gap `2.75rem`.
- Active page: 2px gold underline, offset ~8px below the text. Hover: gold text.
- Not sticky on desktop. On mobile it becomes a fixed bar with the cream background
  and a hamburger opening a full-height slide-in panel from the right.

### Buttons

**Outline (primary on light):** transparent fill, `1.5px solid var(--ink)`, ink text,
uppercase Poppins 500 `0.78rem`, `letter-spacing: 0.14em`, padding `0.9rem 1.6rem`,
`border-radius: 2px`, with a gold `→` after the label. Hover: ink fill, cream text,
arrow shifts right 4px.

**Gold (on the black band):** `--gold` fill, ink text, same type treatment, gold `→`
replaced by an ink arrow. Hover: `--gold-deep`.

### CTA Banner

Full-width black band, appears at the bottom of Home and Services.
- Background `--black-band`, padding `2.25rem 2.5rem`, `border-radius: var(--radius)`,
  sitting inside the container (not edge-to-edge).
- Left: heading "DON'T SEE EXACTLY WHAT YOU'RE LOOKING FOR?" in Oswald 600, cream,
  `1.5rem`. Below it, "There may be another way The Hooks Collective can support you."
  in Poppins 300, `0.9rem`, `rgba(250,244,239,0.75)`.
- A 1px vertical divider in `rgba(250,244,239,0.25)` separates left from right.
- Right: gold button, label "LET'S CONNECT →", links to `contact.html`.
- Under 768px: stacks, divider becomes horizontal, button goes full width.

### Footer

Cream background, 1px top border in `--border`, padding `3rem 0 2rem`.
Centered: logo lockup, then the four nav links inline, then licensure line
"Allana Jackson, Licensed Professional Counselor · Texas & Oklahoma" in `--muted`
`0.8rem`, then copyright.

---

## 4. Page: HOME (`index.html`)

### Hero — split, photo right

Two-column grid, `1fr 1.15fr`, min-height ~78vh, cream background. **The header sits
inside the hero block on this page**, above the grid, so the photo starts below the nav.

Left column, vertically centered, `padding-right: 3rem`:
- H1: `THE HOOKS<br>COLLECTIVE` — Oswald 700, uppercase
- Below it, `MAKING ROOM FOR` — Poppins 600, `1rem`, uppercase, `letter-spacing: 0.06em`, ink
- Directly below, `conversations that matter.` — Playfair Display italic, `1.6rem`, gold
- Paragraph: *We create intentional spaces that deepen understanding, challenge
  perspectives, and create opportunities for meaningful change.*
- Outline button: `LEARN MORE →` linking to `about.html`

Right column: `assets/hero.jpg` (the open notebook reading "your story isn't over").
Full-bleed to the right edge of the viewport, `object-fit: cover`. The notebook must
stay fully in frame — the handwritten phrase is the point of the image.

### Then, below the hero:

1. **Three-up teaser** — "WHAT WE DO", three cards pulling Youth Programming,
   Community Workshops, and Professional Training, each with icon, heading, one-line
   description, and a gold `LEARN MORE →` text link to `services.html`.
2. **Quote band** — `--cream-deep` background, centered, Playfair Display italic
   `clamp(1.5rem, 3.5vw, 2.25rem)` in ink:
   *"Where a story begins doesn't have to determine where it ends."*
   with `— ALLANA JACKSON, LPC` beneath in Poppins 500 uppercase `0.75rem`, gold.
3. **CTA banner**

### Mobile hero

Stacks: photo band on top at `34svh` (min 220px), then the text block below on cream,
with the LEARN MORE button at the bottom. The handwritten phrase must remain readable
inside the band — tune `object-position` against the real photo, starting at
`center 38%`.

---

## 5. Page: ABOUT (`about.html`)

Page title `ABOUT` with gold rule, then a three-column grid: `1fr 1fr 0.9fr`,
gap `3.5rem`, with **1px vertical gold-tinted dividers** (`--border`) between columns 1/2
and 2/3.

**Column 1 — "Meet ALLANA"**
Heading is mixed: `Meet` in Sacramento gold at ~3rem, `ALLANA` in Oswald 700 ink at
~2.75rem, sitting on the same baseline. Gold rule beneath.
Then her bio, verbatim from the current `index.html` About section — do not rewrite it.
First sentence stays as a lead paragraph; the sentences that are currently emphasized
in the mockup are set in Poppins 500 ink rather than 300.
Ends with `— Allana` in Sacramento gold, ~1.75rem.

**Column 2 — "Our STORY"**
Same mixed heading treatment. The Joseph Hooks copy verbatim from the current
`#story` section. The line "The Hooks Collective honors his legacy by making room for
conversations that haven't always had a place." is set in Poppins 500 ink.

**Column 3 — Portrait**
`assets/allana.jpg`, `border-radius: var(--radius-lg)`, `aspect-ratio: 3/4`,
`object-fit: cover`, sticky on desktop (`position: sticky; top: 3rem`).

Under 900px: collapse to one column, portrait first, dividers become horizontal rules.

---

## 6. Page: SERVICES (`services.html`)

Page title `SERVICES` with gold rule, then the intro paragraph:

> The Hooks Collective partners with communities, schools, organizations, and
> professionals to create thoughtful, engaging experiences centered on mental health
> and connection.

Then **five stacked full-width cards**, one per row, gap `1.25rem`:

- White background, `--radius`, `--shadow-card`, `border: 1px solid var(--border)`,
  padding `2.25rem 2.5rem`.
- Grid `180px 1px 1fr`, `align-items: start`, gap `2.5rem`.
- Left cell: a gold line-art SVG icon, ~90px, `stroke: var(--gold)`,
  `stroke-width: 1.5`, `fill: none`, centered in its cell.
- Middle cell: 1px full-height divider in `--border`.
- Right cell: heading in Oswald 600 uppercase `1.5rem`, then body copy.
- Hover: shadow deepens slightly, no movement.

Cards, in order, with copy verbatim from the current site:
1. **YOUTH PROGRAMMING** — icon: three figures with a heart above
2. **COMMUNITY WORKSHOPS** — icon: easel/presentation board with a heart
3. **PROFESSIONAL TRAINING** — icon: easel/flip chart, blank
4. **CONSULTING** — icon: clipboard with checkmarks and a pen
5. **MENTAL HEALTH ADVOCACY** — icon: megaphone with radiating lines

Then the **CTA banner**.

Under 768px: cards become single-column — icon on top at 64px, divider becomes a
horizontal rule beneath it, then the text.

---

## 7. Page: CONTACT (`contact.html`)

Page title `CONTACT` with gold rule and a one-line intro.

Two columns, `1fr 1fr`, gap `4rem`:

**Left** — three info rows, each with a gold line icon:
- Serving Texas, Oklahoma, and virtual engagements nationwide
- The email address (mailto link, gold)
- Replies within two business days

Beneath, the disclaimer block from the current site, restyled: `--cream-deep`
background, 3px gold left border, `0.85rem` in `--muted`. Keep the 988 crisis line.

**Right** — the inquiry form, carried over from the current `contact` section with all
fields, the Netlify attributes (`name="inquiry"`, `data-netlify`, honeypot), the
hidden `form-name` input, and the success state.

Restyle only: white card on cream with `--border` and `--shadow-card`; inputs get
`border-radius: 2px`, 1px `--border`, white fill, and a gold focus ring
(`box-shadow: 0 0 0 3px rgba(196,135,61,0.18)`); labels uppercase Poppins 500
`0.72rem` `letter-spacing: 0.1em` in `--ink`. Submit button uses the outline style at
full width.

---

## 8. JavaScript

`js/main.js` is shared by all four pages and must not error when an element is absent
— guard every lookup. It handles:
- Mobile nav toggle and Escape-to-close
- Hiding `img[data-placeholder]` on error
- Scroll reveal via IntersectionObserver
- Contact form validation, submit, and success state (contact page only)
- Footer year

Remove the navbar `scrolled` logic — the header is no longer sticky on desktop.

---

## 9. Constraints

- Vanilla HTML/CSS/JS. No React, no Tailwind, no Bootstrap, no build step.
- One shared `styles.css` and one shared `main.js` for all pages. No per-page CSS files.
- All icons are inline SVG. No icon fonts, no image sprites, no external icon CDN.
- **Do not rewrite the body copy.** Bios, the Hooks story, and service descriptions
  carry over verbatim. New copy is limited to the hero lines specified in §4.
- Keep `<!-- CUSTOMIZE: -->` comments on every client-editable line.
- Every page needs its own `<title>` and meta description.
- Relative links only (`about.html`, not `/about.html`) so it works from a GitHub
  Pages subpath.
- Mobile-first responsive, verified at 375px. Semantic HTML, alt text, visible focus
  states, AA contrast.
- Gold on cream fails AA at small sizes — gold is for rules, icons, script accents,
  and large type only. **Never** use gold for body copy.

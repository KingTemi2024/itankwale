# Itankwale — Landing Site

Static landing page for **Itankwale™**, an AI energy intelligence platform launching Q4 2027 from Baltimore, MD.

> Itankwale makes community energy *visible*, *profitable*, and *fair* — across every asset a community owns (solar, storage, EV, buildings, microgrid).

---

## Project structure

```
.
├── index.html      # Markup
├── styles.css      # All styling (dark theme, green accent)
├── script.js       # Countdown, form handlers, scroll reveal
├── .nojekyll       # Tells GitHub Pages to skip Jekyll processing
├── .gitignore
└── README.md
```

No build step. No dependencies. Just open `index.html` in a browser.

---

## Local preview

The simplest way:

```bash
# Python 3
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

Or use any other static server (`npx serve`, `live-server`, VS Code Live Server, etc.).

---

## Deploying to GitHub Pages

### Option 1 — User/organisation site (`username.github.io`)

1. Create a repo named exactly `username.github.io` (replace `username` with your GitHub handle).
2. Push these files to the `main` branch.
3. Site is live at `https://username.github.io` within a minute or two.

### Option 2 — Project site (any repo name)

1. Push these files to your repo (e.g. `itankwale-site`) on the `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `(root)`
4. Save. Your site goes live at `https://username.github.io/itankwale-site/` within a minute or two.

### Quickstart commands

```bash
git init
git add .
git commit -m "Initial Itankwale landing site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then enable Pages in repo settings as described above.

---

## Custom domain (optional)

To serve at e.g. `itankwale.com`:

1. Add a file named `CNAME` (no extension) at the repo root containing your domain on a single line:
   ```
   itankwale.com
   ```
2. At your DNS provider, point the domain to GitHub Pages:
   - **Apex (`itankwale.com`)** — A records to:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **`www` subdomain** — CNAME record pointing to `username.github.io`.
3. In **Settings → Pages**, enter the custom domain and tick **Enforce HTTPS** once the cert is issued (usually within an hour).

---

## What the page includes

- Sticky top nav with anchor links
- Hero with launch pill, animated grid, headline, subhead
- Live countdown to **October 1, 2027 09:00** (local time)
- Hero email-capture (visual demo — does not send anywhere yet)
- 3-pillar platform overview (Visibility / Revenue / Justice)
- 4 key stats
- 5-step timeline from "Now" through "Year 5"
- Newsletter signup with topic tag selection (visual demo)
- Footer with team contact emails

---

## Notes on the email forms

The signup forms are currently **visual only** — submitting shows a success state and increments the on-page counter, but does not transmit anything. To wire them up to a real backend later, the cleanest options are:

- **[Formspree](https://formspree.io/)** — point the form `action` at your endpoint
- **[Mailchimp](https://mailchimp.com/) embed** — replace the form HTML with their snippet
- **[ConvertKit](https://convertkit.com/) / Buttondown** — similar embed approach
- **Custom endpoint** — POST to your own API with `fetch` in `script.js`

The `submit` handlers in `script.js` (`heroSubmit`, `nlSubmit`) are the obvious places to plug a real `fetch()` call in.

---

## Editing the launch date

In `script.js`:

```js
var launch = new Date('2027-10-01T09:00:00');
```

Change that one line and the countdown updates everywhere.

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`, `backdrop-filter`, and CSS custom properties — all widely supported. Honours `prefers-reduced-motion`.

---

## Credits

- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [DM Sans](https://fonts.google.com/specimen/DM+Sans), [DM Mono](https://fonts.google.com/specimen/DM+Mono) (Google Fonts)
- Built in Baltimore, MD

© Itankwale

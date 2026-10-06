# The Green Banana — go-live guide

This is the site for **The Green Banana**, starting with **Bali Bread**
(the green banana flour loaf), plus flour on its own and baking premixes —
subscription delivery/pickup for Isla Vista, Goleta, and Santa Barbara.

Your logo, colors, and product naming are already in place. This guide
gets you from "files on a computer" to "live on the internet," and shows
how to edit and republish it yourself going forward.

## What's here

```
index.html          The whole site (one page, anchor-linked sections)
css/style.css        All styling — colors/fonts are CSS variables at the top
js/app.js             Site behavior + the settings you'll actually edit
manifest.json         Makes the site installable as an app on phones
service-worker.js     Lets the site load instantly / work offline once visited
images/logo.png       Your real logo
icons/                App icons generated from your logo
```

## Part 1 — get it live today (about 10 minutes)

No coding, no account needed to see it live first:

1. Unzip the folder you were sent (if you haven't already) so you have a
   normal folder on your computer named `the-green-banana` (or whatever
   you renamed it to) containing `index.html` and the other files above —
   all at the top level, not nested in an extra subfolder.
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** in a
   browser.
3. Drag that whole folder from your computer straight onto the page.
4. Netlify uploads it and gives you a live URL immediately (something like
   `random-name-123.netlify.app`). That's it — the site is live and anyone
   can visit that link right now.
5. Optional but recommended: click **"Sign up to save this site"** (or
   sign up first, then drop the folder) so the site is tied to a free
   Netlify account instead of disappearing after a while. Once you have an
   account, the site shows up at **app.netlify.com** under your team, and
   you can rename its subdomain (Site settings → Change site name) or
   attach a real domain you own (Site settings → Domain management → Add a
   domain).

That's a full deploy — this is genuinely all it takes for a static site
like this one.

## Part 2 — how to edit content

Everything you'd want to change day-to-day is plain text inside
`index.html` (copy, prices, FAQ) or a couple of settings at the top of
`js/app.js` (delivery zips, Stripe links, contact email). No build step,
no compiling — you're editing the actual file that gets shown.

1. **Get a plain-text code editor** (not Microsoft Word or Pages, which
   add hidden formatting that breaks HTML). Free options:
   - [VS Code](https://code.visualstudio.com) — the standard choice, works
     great even if you've never coded.
   - In a pinch, TextEdit (Mac) works if you switch it to *Format → Make
     Plain Text* first, or Notepad on Windows.
2. Open the whole `the-green-banana` folder in the editor (in VS Code:
   File → Open Folder).
3. Open `index.html`. It's mostly readable English between `<tags>` —
   for example, to change a plan price you'd find:
   ```html
   <p class="plan-price">$11<span>/ week</span></p>
   ```
   and just change `$11`. To change wording, edit the text between the
   tags and leave the tags themselves alone. If you're ever unsure whether
   an edit is safe, copy the file's contents into a message here and ask —
   easy to sanity-check before you republish.
4. Save the file.
5. **Republish:** go back to your site on **app.netlify.com**, open the
   **Deploys** tab, and drag the updated folder in again (same as Part 1,
   step 3). The new version goes live in a few seconds. Every edit follows
   this same save → drag-in → live loop — there's no "publish" button
   inside the files themselves.

One gotcha specific to this site: it's installable as an app (a PWA), which
means visitors' phones may cache an old copy for speed. Whenever you make a
real content change and redeploy, also bump the version number in
`service-worker.js`:
```js
const CACHE_NAME = "green-banana-v2";   // bump to v3, v4, ... on each real update
```
That forces phones to fetch the fresh version instead of showing a stale
cached one.

## Part 3 — turn on real subscription payments (Stripe)

The buttons on the subscription plans currently open the waitlist form,
not real checkout, because payment processing has to run under **your**
business, not a third party's — this step is yours to do (about 20–30
minutes, no coding):

1. Create a free account at [stripe.com](https://stripe.com) with your
   business info and a bank account for payouts.
2. In the Stripe Dashboard: **Product catalog → Add product** — create one
   product per plan (Study Pack, Weekly Loaf, Family Box, Pantry Refill),
   each with a **recurring price** matching its interval (every 2 weeks /
   weekly / weekly / monthly).
3. On each product, click **Create payment link**. In the link's settings
   you can turn on **collect shipping address** and **add a custom field**
   (e.g. "Delivery or pickup?") — Stripe collects what you need without any
   custom backend.
4. Paste each payment link URL into `js/app.js`, in the `STRIPE_LINKS`
   object near the top:
   ```js
   const STRIPE_LINKS = {
     "Study Pack": "https://buy.stripe.com/xxxxxxx",
     ...
   };
   ```
   Once a plan has a real link, its "Choose ___" button goes straight to
   Stripe Checkout. Leave any plan blank to keep it pointed at the
   waitlist. Save, then redeploy per Part 2.
5. Stripe emails (and can text, via its dashboard app) you every time
   someone subscribes, and can let customers pause/cancel themselves via
   **Settings → Customer portal**.

This needs no server and no ongoing engineering — Stripe hosts the actual
checkout and billing.

## Part 4 — upgrade the waitlist form (optional)

Right now, submitting the waitlist form opens a pre-filled email to
`milo@ftatlantic.com` — works with zero setup. For a cleaner inline "you're
on the list" confirmation instead of an email app opening:

1. Create a free form at [formspree.io](https://formspree.io) and get its
   endpoint URL.
2. Paste it into `js/app.js` as `FORMSPREE_ENDPOINT`. Save and redeploy.

## Part 5 — fill in your delivery/pickup details

- Edit `DELIVERY_ZIPS` in `js/app.js` to match your actual service area.
- Edit the "Launch zones" list and the pickup-location paragraph in
  `index.html` (search for "pickup location") once your pickup
  schedule/spot is set (farmers market stand, an IV storefront window, etc.).

## Part 6 — product photos (in progress)

The site currently uses simple illustrations instead of real photos.
You mentioned photos from the Mades Banana Flour Cafe acquisition on a
shared iCloud album — those couldn't be pulled in automatically (iCloud
shared albums need a live browser to load, which wasn't available here).
Once you have the actual image files (drag them into a chat with me, or
save them into `images/`), they can replace the icon tiles under "What we
bake" and the hero illustration.

## Later: more products and a "real" native app

- New products (pizza dough, etc.): duplicate a
  `<article class="product-card">` block in `index.html` under
  **Products**, and add a matching plan if it gets its own subscription
  tier.
- A true app-store app: once the site is live and getting real usage, a
  tool like [PWABuilder](https://www.pwabuilder.com) can package this same
  site into an installable Android/iOS app shell without a rewrite. That
  still needs Apple/Google developer accounts ($99/yr and $25 one-time)
  and app review — worth doing once you have traction, not before.

## Questions / next round of changes

Happy to keep iterating: real product photos once you have them, a
self-service "manage my subscription" page after Stripe is connected, SMS
delivery reminders, referral codes for dorms, etc. Just say what to adjust.

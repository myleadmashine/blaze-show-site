# BLAZE SHOW — conversion campaign pages

These pages are separate landing pages added beside the existing GitHub Pages website.

## Pages
- `campaigns/blaze-packages.html` — packages, coupon and three interactive options.
- `campaigns/bollywood.html` — standalone product landing for “Звёзды Болливуда”.
- Shared CSS/JS are loaded from `campaigns/campaign.css` and `campaigns/campaign.js` and `campaigns/campaign-settings.js`.

## Deploy
GitHub Actions extracts the existing site bundle and copies these editable source files into `site/campaigns/`. Edit files in `campaign-files/` and commit to the deployment branch. Do not edit the compressed original archive just to change these campaign pages.

After merge to main:
- https://myleadmashine.github.io/blaze-show-site/campaigns/blaze-packages.html
- https://myleadmashine.github.io/blaze-show-site/campaigns/bollywood.html

## Before paid advertising
1. Confirm the STANDARD 800,000 ₸ package composition in writing.
2. Confirm the coupon rules and final net prices: MOMENT 350,000 ₸, STANDARD 775,000 ₸, CELEBRATION from 2,475,000 ₸ if the 25,000 ₸ coupon is applicable.
3. Confirm the separate Bollywood price 300,000 ₸ and whether the coupon applies.
4. Confirm the exact names, descriptions and price of each 300,000 ₸ interactive.
5. Add the original Bollywood photo/video. The “same room / same people / same fixed camera / normal banquet light then disco light” block is a placeholder until the actual continuous video is inserted.
6. Match each existing Wistia ID to its real video content; generic placeholders are intentionally used until the match is verified.
7. Add real telephone / WhatsApp and a working endpoint in `assets/js/config.js`.
8. Add actual GA4, Google Ads and Yandex Metrica IDs. The campaign code reads GA4 and Yandex Metrica IDs from that file. Microsoft Clarity is also optional.
9. Add the actual public Marquiz URL to `campaign-files/campaign-settings.js` as `window.BLAZE_MARQUIZ_URL`. Until that is set, the “Подобрать программу” button opens the coupon form instead of a quiz.
10. Verify that a real test lead reaches the receiving system and that the team calendar is updated. A browser page view is not proof that the lead delivery works.

Analytics scripts load only after the visitor accepts the analytics banner. Declining analytics does not block the lead form.\n\n## Coupon and deposit
The public offer describes a 25,000 ₸ discount and at least 10% deposit to reserve the date. The precise eligibility, expiry, payment schedule, refund/cancellation terms and what constitutes a confirmed reservation must be written into the proposal and contract. Do not describe the deposit as non-refundable unless that is expressly agreed and legally checked.

## Technical notes
- The campaign pages reuse the existing Wistia IDs but do not claim their content labels are verified.
- Lead form submits to `leadDelivery.endpoint` if configured. If there is no endpoint, it opens WhatsApp only when the corporate WhatsApp number is configured. It does not pretend to have stored the lead.
- Interactive product names and descriptions are pending confirmation against actual Blaze repertoire.
- The two references use different sales patterns. The accessible Provans site is used as a simple offer/coupon/three-price-level model. The IceStore site could not be fetched in the current research session; this standalone Bollywood page is therefore a product-first adaptation using the confirmed Blaze offer, not a pixel-identical copy.

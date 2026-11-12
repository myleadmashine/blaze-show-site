# BLAZE SHOW — two simple campaign pages

## Pages added
- `campaigns/blaze-packages.html` — one main landing with 3 price packages:
  - ECONOM / BLAZE MOMENT: 375,000 ₸ → 350,000 ₸ with coupon.
  - STANDARD / BLAZE SIGNATURE: 800,000 ₸ → 775,000 ₸ with coupon.
  - PREMIUM / BLAZE CELEBRATION: from 2,500,000 ₸ → from 2,475,000 ₸ with coupon.
- `campaigns/bollywood.html` — separate product landing:
  - Bollywood flashmob: 300,000 ₸ → 275,000 ₸ with coupon.
  - Per-guest examples: 100 guests = 3,000 ₸; 300 guests = 1,000 ₸ before coupon.
- Four-step quiz: event type, event date, venue/address, guest count. Phone is collected after those four answers.

## Design approach
Use the reference sites' structure, not their facts: clear first-screen offer, prominent coupon CTA, transparent prices, short proof/benefit blocks, a small FAQ and a direct phone form. Responsive light layout; the pages use the original BLAZE SHOW media already in the repository and the existing Wistia IDs.

## After merge to main
GitHub Actions copies the editable files into the deployed site. Target URLs:
- https://myleadmashine.github.io/blaze-show-site/campaigns/blaze-packages.html
- https://myleadmashine.github.io/blaze-show-site/campaigns/bollywood.html

The current live main site is not overwritten by these pages.

## Required before paid traffic
1. Verify the exact Wistia video IDs: `4nnek73dvf`, `sx1i8mpjne`, `7bjmxjnqsf`, `nwstr5fcgl`. The page uses them, but this build does not have authenticated access to Wistia's management names. Especially verify that the second Bollywood video is the continuous same-camera lighting transition clip.
2. Put the confirmed BLAZE SHOW business WhatsApp number into `assets/js/config.js` as `contacts.whatsappNumber`, or deploy the receiving endpoint and set `leadDelivery.endpoint`. The form intentionally reports that it is not connected if both values are empty; it must not pretend a lead was delivered.
3. Add real GA4, Google Ads and Yandex Metrica IDs to `assets/js/config.js`. Scripts load only after visitor consent.
4. Verify package contents, especially STANDARD at 800,000 ₸ and the inclusion of hostesses, four batyrs, kudalar entrance, two paid dances and one bonus dance.
5. Confirm the 25,000 ₸ coupon conditions and how it applies to each package in the quote/contract.
6. The percentage “99% of guests join” is not shown as a statistic because no measurement evidence was provided. Use it only after collecting real event feedback.

## Booking and deposit
The page states a deposit from 10% after the programme, time slot, venue and terms are agreed and the contract is signed. A date/time is not shown as reserved before the deposit is received. Cancellation, refund and transfer terms belong in the signed contract.

## Optional Marquiz
The four-question built-in quiz works without Marquiz. If an external Marquiz quiz is also needed, add its public URL to `campaign-files/campaign-settings.js`; it remains optional and separate from the short coupon quiz.

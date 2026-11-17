# After action record: share card and description

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for an Open Graph card, a Twitter card, and a meta description reading "Pacos Island is a daily trivia game where you try to find answers to random questions."

## 2. Action

- Set the owner's sentence, as written, as the meta description, the Open Graph description and the Twitter description.
- Added Open Graph tags (type, site name, title, image, image size, image alt text) and Twitter tags (`summary_large_image`, title, description, image, image alt text).
- Made `icons/og.png`, a 1200 × 630 card drawn from the game's own pixel art: the Ixtaluz pier, the striped lighthouse and the beach town, with Paco in his boat and the wordmark in PP Fuji on an ink label. `tools/og.html` draws it and `tools/og.py` rebuilds it. Both sit in `tools/`, which `.assetsignore` keeps off the live site.
- Share scrapers need a full image URL, and the game has no domain yet, so the tags load the image from the public repo on raw.githubusercontent.com.

## 3. Checks

- The card was rendered and reviewed at full size.
- The repo is public, so the image URL loads without a login.

## 4. Gaps

- When the game has its own domain, the two image tags should point at that domain's `/icons/og.png`, and an `og:url` tag can be added.

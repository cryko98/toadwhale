# The Toad Whale — $WHOAD

Official landing page for **The Toad Whale**, a Solana community memecoin built as a tribute to
the whales of $TOAD.

Plain static site — no build step, no dependencies.

```
index.html             markup
styles.css             all styling
script.js              starfield canvas, reveals, tilt, counters, copy, lightbox
toadwhalelogo.jpg      logo + favicon + OG image
toadwhale-palm.jpg     used in the Legend section
toadwhale-torch.jpg    used in the Doctrine call-out
toadwhale-reef.jpg     used as the Depth chart banner
toadwhale-cosmos.jpg   used as the closing section backdrop
meme-*.jpg             meme wall only
```

Every image also appears in the meme wall (`#memes`), which opens a keyboard-navigable
lightbox — arrow keys to move, Esc to close. To add a meme, drop the file in the root and
copy one `<figure class="wall__item">` block in `index.html`; the script picks it up
automatically.

## Local preview

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deploy on Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Build command: *(empty)*. Output directory: `.` (root).
3. Deploy.

## Token

Contract address: `99uqT7jwNRtoQxyAj8FNsdnGPYraiQ7Ex7848Kfzpump`

It appears in three places in `index.html`: the hero box, the "How to Buy" box, and the
DexScreener link in the footer.

## Links

- X: [@thetoadwhale_](https://x.com/thetoadwhale_)
- Chart: DexScreener, linked from the footer

## Things to fill in before launch

- Tokenomics numbers in the `#tokenomics` section. The 90 / 6 / 4 split is placeholder
  copy; a pump.fun launch puts the whole supply on the bonding curve, so this should
  either be corrected or dropped.

## Disclaimer

$WHOAD is a meme token with no intrinsic value or expectation of financial return, and it is
not affiliated with or endorsed by $TOAD.

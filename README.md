# The Toad Whale — $WHOAD

Official landing page for **The Toad Whale**, a Solana community memecoin built as a tribute to
the whales of $TOAD.

Plain static site — no build step, no dependencies.

```
index.html          markup
styles.css          all styling
script.js           starfield canvas, reveals, tilt, counters, copy-to-clipboard
toadwhalelogo.jpg   logo + favicon + OG image
```

## Local preview

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deploy on Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Build command: *(empty)*. Output directory: `.` (root).
3. Deploy.

## Things to fill in before launch

- Contract address — currently the placeholder `xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` in
  `index.html` (two places: hero and the "How to Buy" section).
- Social links — the `href="#"` placeholders in the footer (X, DexScreener).
- Tokenomics numbers in the `#tokenomics` section if the real distribution differs.

## Disclaimer

$WHOAD is a meme token with no intrinsic value or expectation of financial return, and it is
not affiliated with or endorsed by $TOAD.

# Next MDX Deck

Forked from <https://github.com/whoisryosuke/next-mdx-deck>

Create presentation decks using MDX, React, and [Next.js](https://nextjs.org/).

## TODO

- Import/Copy View
- Import/Copy/Clone Controls
  - Swap or adapt Styling
- Deploy to vercel

## Usage

```bash
# See ../site
npm run dev
```

## Theming the Slideshow

Theming is accomplished with **CSS custom properties** and/or **Styled Components**.

Design tokens are stored as CSS custom properties inside the SlidePage layout (`/layouts/SlidePage.jsx`), which are injected into the app using Styled Component's global styling utility. There you can change the color of text, background colors, fonts, etc.

## Presentation Mode

- Press `ALT/OPT + P` to toggle presentation mode on and off.
- You can also add the `mode` query parameter to the URL (e.g. `http://localhost:3000/slides/1?mode=presentation`).

The most common way to use presentation mode:

1. Open two browser tabs with any slide page.
2. Activate presentation mode in one tab.
3. Navigate through slides - they'll be synced in both tabs!

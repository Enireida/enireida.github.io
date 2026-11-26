# Tirana Caffe

A one-page website for a café: bakery, kitchen and high tea.
Plain HTML, CSS and JavaScript, no build step.

## Files

- `index.html` – the page and the hand-drawn icons
- `css/style.css` – colours, type and layout (colours are at the top, in `:root`)
- `js/main.js` – mobile menu, the live Open/Closed door sign and the reservation ticket
- `img/favicon.svg` – the browser icon

## Run it

Open `index.html` in a browser, or serve the folder:

    python -m http.server 8000

Then visit http://localhost:8000.

## Notes

- The booking form checks the fields and shows a confirmation, but it does not send anything yet. Connect it to an email service or a small backend before going live.
- The address and phone number are not on the page yet. Add them in the "Visit us" section.
- Fonts come from Google Fonts: Bodoni Moda, EB Garamond and Pinyon Script.
- All illustrations (pastries, tea stand, flourish) are inline SVG at the bottom of `index.html`.

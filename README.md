# F1 Results Page

## Overview
This simple page lets you browse Formula 1 seasons by year and view race results. Workflow: select a year → view a table of rounds for that season → click a round to view detailed race results.

## How to Run
1. Open `results.html` in your browser (double-click or use a local static file server).
2. The Year selector on the left shows five years at a time (1950–2025) and initially displays 2021–2025.
3. Select a year to load rounds. Click a round to load that race's results.

## API Information
- Season data: `https://api.jolpi.ca/ergast/f1/<<year>>.json`
  - Replace `<<year>>` with the selected year. The response `MRData.total` is used to determine the number of rounds (fallback to the number of races returned).
- Race results: `https://api.jolpi.ca/ergast/f1/<<year>>/<<round>>/results.json`
  - Replace `<<round>>` with the round number (1-indexed).

## File Structure
- `results.html` — The main HTML page.
- `styles.css` — CSS styles for layout and UI.
- `app.js` — JavaScript that populates years, calls the APIs, and renders the rounds and results.

## Notes
- An internet connection is required for API data.
- The page uses a native `<select size="5">` element to show five years at a time and programmatically scrolls to display the latest years on load.


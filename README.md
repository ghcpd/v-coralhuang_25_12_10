# F1 Results Viewer

Overview
- Simple page for browsing Formula 1 seasons by year. Workflow: select year → view list of rounds → click a round to view race results.

How to Run
- Open results.html in a browser (double-click or use File → Open). An internet connection is required to fetch API data.

API Info
- Season data: `https://api.jolpi.ca/ergast/f1/<<year>>.json` — replace `<<year>>` with the chosen year to retrieve season metadata (contains the `total` field and race list).
- Race results: `https://api.jolpi.ca/ergast/f1/<<year>>/<<round>>/results.json` — replace `<<year>>` and `<<round>>` to retrieve detailed results for a specific round.

File Structure
- results.html — main page layout
- styles.css — simple styling to keep UI clean and modern
- script.js — JS logic to populate years, fetch APIs, and render tables

Notes
- The year selector lists years 1950–2025 with 5 visible items at a time. On first load the selector is scrolled to show 2021–2025 (you can scroll back to 1950).
- The page requires an internet connection to load API data.

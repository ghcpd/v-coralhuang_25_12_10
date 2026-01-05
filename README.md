# F1 Race Results Viewer

## Overview

This is a single-page web application that allows users to explore Formula 1 race results from 1950 to 2025. The workflow is simple:

1. **Select a Year** – Choose a year from the dropdown (1950–2025)
2. **View Rounds** – See all race rounds for the selected season in a table
3. **View Results** – Click on any round to display detailed race results including driver positions, constructors, lap times, and points

## How to Run

1. **Open the file**: Simply double-click `results.html` or open it in any modern web browser (Chrome, Firefox, Edge, Safari, etc.)
2. **Select a year**: Use the dropdown at the top to choose a Formula 1 season
3. **Browse rounds**: A table of all races for that season will appear
4. **View race details**: Click on any race row to see detailed results below

No installation or setup required – just open and use!

## API Information

This application uses the Ergast F1 API (via jolpi.ca) to fetch race data:

### Season Data API
```
https://api.jolpi.ca/ergast/f1/<<year>>.json
```
- **Purpose**: Fetches all races for a given season
- **`<<year>>`**: Replace with the selected year (e.g., 2025, 2024, etc.)
- **Returns**: List of races including round numbers, race names, circuits, locations, and dates

### Race Results API
```
https://api.jolpi.ca/ergast/f1/<<year>>/<<round>>/results.json
```
- **Purpose**: Fetches detailed results for a specific race
- **`<<year>>`**: The season year (e.g., 2025)
- **`<<round>>`**: The round number within that season (e.g., 1, 2, 3, etc.)
- **Returns**: Complete race results including driver positions, teams, lap counts, finishing times/status, and points

## File Structure

This is a single-file application:

- **`results.html`** – Contains all HTML structure, CSS styling, and JavaScript functionality
  - **HTML**: Year dropdown, rounds table, and race results sections
  - **CSS**: Modern gradient design with responsive tables, hover effects, and podium highlighting
  - **JavaScript**: API integration, event handlers for year/round selection, and dynamic content rendering

## Technical Notes

- **Internet Connection Required**: This application fetches live data from the Ergast F1 API, so an active internet connection is necessary
- **Browser Compatibility**: Works with all modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design**: The layout adapts to different screen sizes for mobile and desktop viewing
- **Error Handling**: Displays user-friendly error messages if API requests fail
- **Visual Features**:
  - Dropdown shows 5 years at a time (scrollable)
  - Selected rounds are highlighted in the table
  - Podium finishes (1st, 2nd, 3rd) have special background colors
  - Clean gradient purple theme throughout

## Credits

Race data provided by the [Ergast F1 API](http://ergast.com/mrd/) via jolpi.ca.

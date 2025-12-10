const API_BASE = 'https://api.jolpi.ca/ergast/f1';
const yearSelect = document.getElementById('yearSelect');
const roundsTableBody = document.querySelector('#roundsTable tbody');
const seasonLabel = document.getElementById('seasonLabel');
const resultsContainer = document.getElementById('resultsContainer');
let selectedRoundRow = null;
let selectedYear = null;
let selectedRound = null;

function createYearOptions() {
  const START = 1950, END = 2025;
  for (let y = END; y >= START; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
  // Default: show 2021-2025 and select 2025
  const defaultYear = 2025;
  yearSelect.value = String(defaultYear);
  // scroll to make the default visible at the bottom of the five-item window
  const selectedOpt = yearSelect.querySelector(`option[value="${defaultYear}"]`);
  if (selectedOpt && selectedOpt.scrollIntoView) {
    // put it at the end of the view so 2021-2025 are visible
    selectedOpt.scrollIntoView({block:'end'});
  }
}

async function fetchSeason(year) {
  clearRounds();
  seasonLabel.textContent = year;
  resultsContainer.innerHTML = '<div class="placeholder">Loading season data…</div>';
  try {
    const res = await fetch(`${API_BASE}/${year}.json`);
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const data = await res.json();

    // MRData.total is expected; fallback to races length
    const total = parseInt((data?.MRData?.total) || 0, 10) || (data?.MRData?.RaceTable?.Races?.length || 0);
    const races = data?.MRData?.RaceTable?.Races || [];

    renderRounds(year, total, races);
    resultsContainer.innerHTML = '<div class="placeholder">Select a round to view detailed race results.</div>';
  } catch (err) {
    resultsContainer.innerHTML = `<div class="placeholder" style="color:var(--danger)">Failed to load season: ${err.message}</div>`;
  }
}

function clearRounds() {
  roundsTableBody.innerHTML = '';
  selectedRound = null;
  selectedRoundRow = null;
}

function renderRounds(year, total, races) {
  roundsTableBody.innerHTML = '';
  const rounds = total > 0 ? total : races.length;
  for (let r = 1; r <= rounds; r++) {
    const row = document.createElement('tr');
    row.dataset.round = r;
    const raceInfo = races.find(R => parseInt(R.round,10) === r) || {};

    row.innerHTML = `
      <td>${r}</td>
      <td>${raceInfo.raceName || 'TBD'}</td>
      <td>${raceInfo.date || ''}</td>
      <td>${(raceInfo.Circuit && raceInfo.Circuit.circuitName) || ''}</td>
    `;

    row.addEventListener('click', () => selectRound(year, r, row));
    roundsTableBody.appendChild(row);
  }
}

async function selectRound(year, round, rowElement) {
  // highlight
  if (selectedRoundRow) selectedRoundRow.classList.remove('selected');
  rowElement.classList.add('selected');
  selectedRoundRow = rowElement;
  selectedYear = year;
  selectedRound = round;

  // fetch results
  resultsContainer.innerHTML = `<div class="placeholder">Loading results for round ${round}…</div>`;
  try {
    const res = await fetch(`${API_BASE}/${year}/${round}/results.json`);
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const data = await res.json();
    const race = data?.MRData?.RaceTable?.Races?.[0];
    if (!race) {
      resultsContainer.innerHTML = '<div class="placeholder">No race data available for this round.</div>';
      return;
    }

    renderResults(race);
  } catch (err) {
    resultsContainer.innerHTML = `<div class="placeholder" style="color:var(--danger)">Failed to load results: ${err.message}</div>`;
  }
}

function renderResults(race) {
  const raceMeta = `<div class="race-meta"><strong>${race.raceName}</strong> &nbsp; <span class="muted">${race.date} — ${race.Circuit.circuitName}</span></div>`;
  const results = race.Results || [];
  if (!results.length) {
    resultsContainer.innerHTML = raceMeta + '<div class="placeholder">No results available for this race.</div>';
    return;
  }

  let table = '<table class="results-table"><thead><tr><th>Pos</th><th>Driver</th><th>Constructor</th><th>Laps</th><th>Time / Status</th><th>Points</th></tr></thead><tbody>';
  for (const r of results) {
    const driverName = [r.Driver.givenName, r.Driver.familyName].filter(Boolean).join(' ');
    const constructor = r.Constructor?.name || '';
    const timeOrStatus = (r.Time && r.Time.time) ? r.Time.time : (r.status || '');
    table += `<tr>
      <td>${r.position}</td>
      <td>${driverName} <span class="muted">(#${r.number || ''})</span></td>
      <td>${constructor}</td>
      <td>${r.laps}</td>
      <td>${timeOrStatus}</td>
      <td>${r.points}</td>
    </tr>`;
  }
  table += '</tbody></table>';

  resultsContainer.innerHTML = raceMeta + table;
}

// Event wiring
yearSelect.addEventListener('change', () => {
  const year = yearSelect.value;
  fetchSeason(year);
});

// Init
createYearOptions();
// load default season
fetchSeason(yearSelect.value);

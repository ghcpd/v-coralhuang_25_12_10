const yearSelect = document.getElementById('yearSelect');
const selectedYearSpan = document.getElementById('selectedYear');
const roundsTableBody = document.querySelector('#roundsTable tbody');
const resultsWrapper = document.getElementById('resultsWrapper');
let currentYear = null;
let currentRoundRow = null;

function buildYears(start=1950, end=2025){
  for(let y=end; y>=start; y--){
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}

async function fetchSeason(year){
  clearRounds();
  markSelectedYear(year);
  selectedYearSpan.textContent = year;
  resultsWrapper.innerHTML = '<div class="empty">Select a round to view results.</div>';

  try{
    const url = `https://api.jolpi.ca/ergast/f1/${year}.json`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const total = parseInt(data?.MRData?.total || 0, 10);
    const races = data?.MRData?.RaceTable?.Races || [];

    if(total === 0){
      roundsTableBody.innerHTML = `<tr><td colspan="3" class="empty">No rounds found for ${year}.</td></tr>`;
      return;
    }

    for(let r=1; r<=total; r++){
      const raceInfo = races.find(rc => parseInt(rc.round) === r) || {};
      const tr = document.createElement('tr');
      tr.dataset.round = r;
      tr.innerHTML = `<td>${r}</td><td>${raceInfo.raceName || 'Round ' + r}</td><td>${raceInfo.date || ''}</td>`;
      tr.addEventListener('click',()=>onRoundClick(year, r, tr));
      roundsTableBody.appendChild(tr);
    }
  }catch(err){
    roundsTableBody.innerHTML = `<tr><td colspan="3" class="error">Error loading season data: ${err.message}</td></tr>`;
  }
}

function clearRounds(){
  roundsTableBody.innerHTML = '';
  if(currentRoundRow){
    currentRoundRow.classList.remove('row-selected');
    currentRoundRow = null;
  }
}

function markSelectedYear(year){
  currentYear = year;
  // visually highlight the select box
  yearSelect.classList.add('year-highlight');
  // remove highlight after a short while so it remains subtle
  setTimeout(()=> yearSelect.classList.remove('year-highlight'), 700);
}

async function onRoundClick(year, round, rowElement){
  // highlight selected round
  if(currentRoundRow) currentRoundRow.classList.remove('row-selected');
  rowElement.classList.add('row-selected');
  currentRoundRow = rowElement;

  resultsWrapper.innerHTML = '<div class="empty">Loading results...</div>';
  try{
    const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const race = data?.MRData?.RaceTable?.Races?.[0];
    const results = race?.Results || [];
    renderResults(race, results);
  }catch(err){
    resultsWrapper.innerHTML = `<div class="error">Error loading results: ${err.message}</div>`;
  }
}

function renderResults(race, results){
  if(!race){
    resultsWrapper.innerHTML = `<div class="empty">No results available.</div>`;
    return;
  }
  const caption = `<div class="results-caption">${race.raceName} — ${race.Circuit?.circuitName || ''} (${race.date || ''})</div>`;
  if(results.length === 0){
    resultsWrapper.innerHTML = caption + '<div class="empty">No result entries for this race.</div>';
    return;
  }
  let table = `<table class="results-table"><thead><tr><th>Pos</th><th>Driver</th><th>Constructor</th><th>Laps</th><th>Time</th><th>Pts</th></tr></thead><tbody>`;
  for(const r of results){
    const driver = `${r.Driver.givenName} ${r.Driver.familyName}`;
    const constructor = r.Constructor?.name || '';
    const time = (r.Time && r.Time.time) ? r.Time.time : (r.status || '');
    table += `<tr><td>${r.position}</td><td>${driver}</td><td>${constructor}</td><td>${r.laps}</td><td>${time}</td><td>${r.points}</td></tr>`;
  }
  table += '</tbody></table>';
  resultsWrapper.innerHTML = caption + table;
}

// Initialize UI
(function init(){
  buildYears(1950,2025);
  // Select 2025 and make the select show the last 5 items (2021-2025) on load.
  const lastIndex = yearSelect.options.length - 1;
  yearSelect.selectedIndex = lastIndex;
  // scroll to bottom so last 5 items are visible
  setTimeout(()=>{ yearSelect.scrollTop = yearSelect.scrollHeight; }, 50);

  // handle year change
  yearSelect.addEventListener('change', (e)=>{
    const y = parseInt(e.target.value, 10);
    if(!Number.isNaN(y)) fetchSeason(y);
  });

  // Trigger initial fetch for 2025
  const initialYear = parseInt(yearSelect.value, 10);
  if(initialYear) fetchSeason(initialYear);
})();
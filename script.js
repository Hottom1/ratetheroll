let rankings = [];

// Load rankings from localStorage if available
if (localStorage.getItem('rankings')) {
  rankings = JSON.parse(localStorage.getItem('rankings'));
  updateRankingsTable();
}

// Form submission
document.getElementById('ratingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const rollerName = document.getElementById('rollerName').value;
  const herbType = document.getElementById('herbType').value;
  const rollDate = document.getElementById('rollDate').value;
  const structure = parseInt(document.getElementById('structure').value);
  const burn = parseInt(document.getElementById('burn').value);
  const airflow = parseInt(document.getElementById('airflow').value);
  const aesthetics = parseInt(document.getElementById('aesthetics').value);
  const efficiency = parseInt(document.getElementById('efficiency').value);

  const totalScore = structure + burn + airflow + aesthetics + efficiency;

  const rating = {
    name: rollerName,
    herbType: herbType,
    date: rollDate,
    scores: { structure, burn, airflow, aesthetics, efficiency },
    totalScore
  };

  rankings.push(rating);
  updateRankingsTable();
  saveToLocalStorage();
  e.target.reset();
});

// Update rankings table
function updateRankingsTable() {
  const tbody = document.querySelector('#rankingsTable tbody');
  tbody.innerHTML = '';

  rankings.forEach((rating, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rating.name}</td>
      <td>${rating.herbType}</td>
      <td>${rating.date}</td>
      <td>${rating.scores.structure}</td>
      <td>${rating.scores.burn}</td>
      <td>${rating.scores.airflow}</td>
      <td>${rating.scores.aesthetics}</td>
      <td>${rating.scores.efficiency}</td>
      <td>${rating.totalScore}</td>
      <td><button onclick="removeRating(${index})">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Remove a rating
function removeRating(index) {
  rankings.splice(index, 1);
  updateRankingsTable();
  saveToLocalStorage();
}

// Sort table by column
document.querySelectorAll('#rankingsTable th').forEach(header => {
  header.addEventListener('click', () => {
    const sortKey = header.getAttribute('data-sort');
    sortTable(sortKey);
  });
});

function sortTable(sortKey) {
  rankings.sort((a, b) => {
    if (sortKey === 'name' || sortKey === 'herbType' || sortKey === 'date') {
      return a[sortKey].localeCompare(b[sortKey]);
    } else if (sortKey === 'totalScore') {
      return b.totalScore - a.totalScore;
    } else {
      return b.scores[sortKey] - a.scores[sortKey];
    }
  });
  updateRankingsTable();
}

// Export data as CSV
document.getElementById('exportData').addEventListener('click', () => {
  const headers = ["Name", "Brand/Type of Herb", "Date", "Structure", "Burn", "Airflow", "Aesthetics", "Efficiency", "Total Score"];
  const rows = rankings.map(rating => [
    rating.name,
    rating.herbType,
    rating.date,
    rating.scores.structure,
    rating.scores.burn,
    rating.scores.airflow,
    rating.scores.aesthetics,
    rating.scores.efficiency,
    rating.totalScore
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'joint_rankings.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Import data
document.getElementById('importData').addEventListener('click', () => {
  const fileInput = document.getElementById('importFile');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      rankings = JSON.parse(e.target.result);
      updateRankingsTable();
      saveToLocalStorage();
    };
    reader.readAsText(file);
  }
});

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('rankings', JSON.stringify(rankings));
}
// Utility: fetch JSON from API
async function fetchJSON(url) {
  const resp = await fetch(url);
  return await resp.json();
}

// Panel switching
window.showPanel = function(panel) {
  document.getElementById('feedPanel').style.display = panel==='feed'?'' : 'none';
  document.getElementById('logsPanel').style.display = panel==='logs'?'' : 'none';
  document.getElementById('settingsPanel').style.display = panel==='settings'?'' : 'none';
};

// Renderers
// Only keep one renderLiveFeed function, remove duplicate below if present.
function renderTimeline(data) {
  const ctx = document.getElementById('timelineChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Attacks',
        data: data.values,
        borderColor: '#8ec6f8',
        backgroundColor: 'rgba(142,198,248,0.15)',
        fill: true,
        tension: 0.2,
        pointRadius: 3
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } }
    }
  });
}

function renderTypePie(data) {
  const ctx = document.getElementById('typeChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: ['#8ec6f8','#ffe066','#ff6767','#6ee7b7','#c084fc','#fbbf24'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

function renderTopAttackers(data) {
  const ctx = document.getElementById('topAttackersChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Hits',
        data: data.values,
        backgroundColor: '#ff6767',
        borderRadius: 8
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } }
    }
  });
}

function renderMap(points) {
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM contributors' }).addTo(map);
  points.forEach(([lat, lon], idx) => {
    const marker = L.circleMarker([lat, lon], {
      radius: 7,
      color: '#ff6767',
      fillColor: '#ff6767',
      fillOpacity: 0.6,
      weight: 2
    }).addTo(map);
    marker._path.style.transform = 'scale(0.3)';
    marker._path.style.transition = 'transform 0.5s cubic-bezier(.68,-0.55,.27,1.55)';
    setTimeout(() => marker._path.style.transform = 'scale(1)', 80 + idx*80);
  });
}


function iconForType(type) {
  if (!type) return '🛡️';
  if (type.includes('login')) return '🔑';
  if (type.includes('upload')) return '📁';
  if (type.includes('shell')) return '💻';
  if (type.includes('api')) return '🔗';
  if (type.includes('block')) return '🚫';
  return '🛡️';
}

function renderLogs(logs) {
  document.getElementById('logsArea').textContent = JSON.stringify(logs, null, 2);
}

// Chart instances for live update
let timelineChart, typePieChart, topAttackersChart, topPortsChart;

// Load all dashboard data (with animation)
async function loadDashboard() {
  const [timeline, typePie, topAttackers, mapPoints, liveFeed, logs, topPorts, protoPie] = await Promise.all([
    fetchJSON('/api/dashboard/timeline'),
    fetchJSON('/api/dashboard/typepie'),
    fetchJSON('/api/dashboard/topattackers'),
    fetchJSON('/api/dashboard/mappoints'),
    fetchJSON('/api/dashboard/livefeed'),
    fetchJSON('/api/dashboard/logs'),
    fetchJSON('/api/dashboard/topports'),
    fetchJSON('/api/dashboard/protopie'),
  ]);
  renderTimeline(timeline);
  renderTypePie(typePie);
  renderTopAttackers(topAttackers);
  renderMap(mapPoints);
  renderLiveFeed(liveFeed);
  renderLogs(logs);
  renderTopPorts(topPorts);
  renderProtoPie(protoPie);
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setInterval(loadDashboard, 10000); // Auto-refresh every 10s
});

// Animate new feed items
function renderLiveFeed(feed) {
  const ul = document.getElementById('liveFeed');
  const prevItems = Array.from(ul.children).map(li => li.textContent);
  ul.innerHTML = '';
  feed.forEach((evt, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span style='font-size:1.3em;'>${iconForType(evt.type)}</span> <span style='color:#ffe066;font-weight:600;'>${evt.type}</span> <span style='color:#8ec6f8;'>${evt.ip||''}</span> <span style='color:#bbb;'>${evt.time||''}</span>`;
    if (!prevItems.includes(li.textContent)) {
      li.style.background = '#ffe06622';
      setTimeout(()=>li.style.background='', 1200);
    }
    ul.appendChild(li);
  });
}

// Top Ports and Protocol Pie
function renderTopPorts(data) {
  const ctx = document.getElementById('topPortsChart').getContext('2d');
  if (topPortsChart) topPortsChart.destroy();
  topPortsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Hits',
        data: data.values,
        backgroundColor: '#6ee7b7',
        borderRadius: 8
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } }
    }
  });
}
function renderProtoPie(data) {
  const ctx = document.getElementById('protoPieChart').getContext('2d');
  if (window.protoPieChart) window.protoPieChart.destroy();
  window.protoPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: ['#8ec6f8','#ffe066','#ff6767','#6ee7b7','#c084fc','#fbbf24'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}


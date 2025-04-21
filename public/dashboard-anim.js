/* global L, map */
// Animated Counter for Stat Boxes
function animateCounter(el, end, duration = 1200) {
  let start = 0;
  const step = Math.ceil(end / (duration / 16));
  const update = () => {
    start += step;
    if (start >= end) {
      el.textContent = end;
    } else {
      el.textContent = start;
      requestAnimationFrame(update);
    }
  };
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  // Animate stat counters
  document.querySelectorAll('.stat-box p').forEach(el => {
    const end = parseInt(el.textContent);
    if (!isNaN(end)) animateCounter(el, end);
  });

  // Animate log entries
  document.querySelectorAll('.log-section pre').forEach(pre => {
    pre.style.opacity = 0;
    setTimeout(() => { pre.style.transition = 'opacity 1.2s'; pre.style.opacity = 1; }, 200);
  });

  // Animate map markers
  if (window.L && window.map && window.geoPoints) {
    window.geoPoints.forEach(([lat, lon], idx) => {
      setTimeout(() => {
        const marker = L.circleMarker([lat, lon], {
          radius: 7,
          color: '#ff6767',
          fillColor: '#ff6767',
          fillOpacity: 0.6,
          weight: 2
        }).addTo(window.map);
        marker._path.style.transform = 'scale(0.3)';
        marker._path.style.transition = 'transform 0.5s cubic-bezier(.68,-0.55,.27,1.55)';
        setTimeout(() => marker._path.style.transform = 'scale(1)', 80);
      }, idx * 100);
    });
  }
});

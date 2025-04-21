/**
 * Netflix-inspired Dashboard with Advanced Animations
 * Features:
 * - Smooth animations and transitions
 * - Responsive design
 * - Dark/light mode toggle
 * - Interactive charts with hover effects
 * - Live data updates with visual feedback
 */

// Performance optimization for Chart.js
// This reduces animation complexity and prevents requestAnimationFrame violations
if (window.Chart) {
  Chart.defaults.animation.duration = 750;
  Chart.defaults.animation.easing = 'easeOutCubic';
  Chart.defaults.animation.delay = 0;
  Chart.defaults.animation.loop = false;
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.tooltip.enabled = true;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  Chart.defaults.plugins.tooltip.titleFont = { size: 14 };
  Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;
  Chart.defaults.plugins.tooltip.caretSize = 6;
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.line.tension = 0.3;
  Chart.defaults.elements.line.borderWidth = 2;
  Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;
  Chart.defaults.plugins.legend.labels.font = { size: 13 };
  // Disable animations on mobile devices for better performance
  if (window.innerWidth < 768) {
    Chart.defaults.animation.duration = 0;
  }
}

// Utility: fetch JSON from API with loading animation
async function fetchJSON(url) {
  showLoading();
  try {
    const resp = await fetch(url);
    
    // Check for authentication issues
    if (resp.status === 401 || resp.status === 403) {
      hideLoading();
      alertSystem.show({
        message: 'Authentication required. Please log in.',
        type: 'error',
        timeout: 7000
      });
      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      throw new Error('Authentication required');
    }
    
    // Check for other HTTP errors
    if (!resp.ok) {
      hideLoading();
      alertSystem.show({
        message: `Server error: ${resp.status} ${resp.statusText}`,
        type: 'error'
      });
      throw new Error(`HTTP error ${resp.status}`);
    }
    
    // Check for content type to avoid parsing HTML as JSON
    const contentType = resp.headers.get('content-type');
    // More lenient check - some servers might return text/json or other variants
    if (!contentType || !(contentType.includes('json') || contentType.includes('application/javascript'))) {
      hideLoading();
      console.error('Invalid content type:', contentType);
      alertSystem.show({
        message: 'Invalid response format. Expected JSON but got: ' + (contentType || 'unknown'),
        type: 'error'
      });
      throw new Error('Invalid response format');
    }
    
    const data = await resp.json();
    hideLoading();
    return data;
  } catch (error) {
    hideLoading();
    
    // Don't show alert for authentication errors (already handled)
    if (error.message !== 'Authentication required') {
      alertSystem.show({
        message: `Failed to fetch data: ${error.message}`,
        type: 'error'
      });
    }
    
    throw error;
  }
}

// Loading animation
function showLoading() {
  let loader = document.querySelector('.loading');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'loading';
    loader.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loader);
  }
  loader.style.display = 'flex';
}

function hideLoading() {
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      loader.style.opacity = '1';
    }, 300);
  }
}

// Panel switching with animation
window.showPanel = function(panel) {
  const panels = {
    'feed': document.getElementById('feedPanel'),
    'logs': document.getElementById('logsPanel'),
    'settings': document.getElementById('settingsPanel')
  };
  
  // Hide all panels with animation
  Object.values(panels).forEach(p => {
    if (p && p.style.display !== 'none') {
      p.style.opacity = '0';
      setTimeout(() => {
        p.style.display = 'none';
      }, 300);
    }
  });
  
  // Show selected panel with animation
  if (panels[panel]) {
    setTimeout(() => {
      panels[panel].style.display = '';
      panels[panel].style.opacity = '0';
      setTimeout(() => {
        panels[panel].style.opacity = '1';
      }, 50);
    }, 300);
  }
  
  // Update active nav link
  document.querySelectorAll('.sidebar nav a').forEach(a => {
    a.classList.remove('active');
    if (a.textContent.toLowerCase().includes(panel)) {
      a.classList.add('active');
    }
  });
};

// Mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      menuToggle.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768;
      const clickedOutsideSidebar = !sidebar.contains(e.target) && e.target !== menuToggle;
      
      if (isMobile && sidebar.classList.contains('open') && clickedOutsideSidebar) {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  }
}

// Dark mode toggle
function setupDarkModeToggle() {
  const toggle = document.createElement('div');
  toggle.className = 'dark-mode-toggle';
  toggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"></path></svg>';
  document.body.appendChild(toggle);
  
  // Check for saved preference
  if (localStorage.getItem('darkMode') === 'light') {
    document.body.classList.add('light-mode');
    updateDarkModeIcon(true);
  }
  
  toggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', isLightMode ? 'light' : 'dark');
    updateDarkModeIcon(isLightMode);
    updateChartColors();
  });
}

function updateDarkModeIcon(isLightMode) {
  const toggle = document.querySelector('.dark-mode-toggle');
  if (toggle) {
    toggle.innerHTML = isLightMode 
      ? '<svg viewBox="0 0 24 24"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"></path></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"></path></svg>';
  }
}

// Chart theme based on dark/light mode
function getChartTheme() {
  const isLightMode = document.body.classList.contains('light-mode');
  return {
    text: isLightMode ? '#333333' : '#ffffff',
    grid: isLightMode ? '#dddddd' : '#333333',
    background: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.2)'
  };
}

// Update all charts when theme changes
function updateChartColors() {
  if (window.timelineChart) updateTimelineChart(window.lastTimelineData);
  if (window.typePieChart) updateTypePieChart(window.lastTypeData);
  if (window.topAttackersChart) updateTopAttackersChart(window.lastAttackersData);
}

// Chart renderers with enhanced visuals
function updateTimelineChart(data) {
  window.lastTimelineData = data;
  const ctx = document.getElementById('timelineChart').getContext('2d');
  const theme = getChartTheme();
  
  // Destroy existing chart if it exists
  if (window.timelineChart && typeof window.timelineChart.destroy === 'function') {
    window.timelineChart.destroy();
  }
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(229, 9, 20, 0.6)');
  gradient.addColorStop(1, 'rgba(229, 9, 20, 0)');
  
  window.timelineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Attacks',
        data: data.values,
        borderColor: '#e50914',
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#e50914',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#e50914',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          labels: { color: theme.text, font: { size: 14 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
          padding: 12,
          cornerRadius: 6,
          caretSize: 8
        }
      },
      scales: {
        x: {
          grid: { color: theme.grid, drawBorder: false },
          ticks: { color: theme.text }
        },
        y: {
          grid: { color: theme.grid, drawBorder: false },
          ticks: { color: theme.text }
        }
      }
    }
  });
}

function updateTypePieChart(data) {
  window.lastTypeData = data;
  const ctx = document.getElementById('typeChart').getContext('2d');
  const theme = getChartTheme();
  
  if (window.typePieChart && typeof window.typePieChart.destroy === 'function') {
    window.typePieChart.destroy();
  }
  
  window.typePieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          '#e50914', // Netflix red
          '#4285F4', // Google blue
          '#FBBC05', // Google yellow
          '#34A853', // Google green
          '#EA4335', // Google red
          '#673AB7', // Purple
          '#FF9800'  // Orange
        ],
        borderColor: theme.background,
        borderWidth: 2,
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        animateScale: false, // Disable scale animation for better performance
        duration: 800,
        easing: 'easeOutCubic'
      },
      resizeDelay: 100, // Debounce resize events
      devicePixelRatio: window.devicePixelRatio || 1, // Optimize for device
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: theme.text,
            padding: 15,
            font: { size: 13 },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
          padding: 12,
          cornerRadius: 6,
          caretSize: 8
        }
      }
    }
  });
}

function updateTopAttackersChart(data) {
  window.lastAttackersData = data;
  const ctx = document.getElementById('topAttackersChart').getContext('2d');
  const theme = getChartTheme();
  
  if (window.topAttackersChart && typeof window.topAttackersChart.destroy === 'function') {
    window.topAttackersChart.destroy();
  }
  
  window.topAttackersChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Attacks',
        data: data.values,
        backgroundColor: '#e50914',
        borderRadius: 6,
        maxBarThickness: 35,
        hoverBackgroundColor: '#f40612'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
          padding: 12,
          cornerRadius: 6,
          caretSize: 8
        }
      },
      scales: {
        x: {
          grid: { color: theme.grid, drawBorder: false },
          ticks: { color: theme.text }
        },
        y: {
          grid: { color: theme.grid, drawBorder: false },
          ticks: { color: theme.text }
        }
      }
    }
  });
}

// Map renderer with enhanced visuals
function updateMap(points) {
  // Clear existing map
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = '';
  
  // Create map with dark theme
  const isLightMode = document.body.classList.contains('light-mode');
  const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    zoomControl: false,
    attributionControl: false
  });
  
  // Add dark/light theme tiles
  if (isLightMode) {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);
  } else {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);
  }
  
  // Add attack points with pulsing effect
  points.forEach(point => {
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: 5,
      color: '#e50914',
      fillColor: '#e50914',
      fillOpacity: 0.7,
      weight: 2
    }).addTo(map);
    
    // Pulse animation
    function pulse() {
      marker.setStyle({ radius: 5 });
      setTimeout(() => {
        marker.setStyle({ radius: 8 });
        setTimeout(() => {
          marker.setStyle({ radius: 5 });
        }, 500);
      }, 500);
    }
    
    // Start pulse animation
    pulse();
    setInterval(pulse, 3000);
    
    // Add tooltip
    marker.bindTooltip(`${point.country}<br>Attacks: ${point.count}`, {
      className: 'map-tooltip',
      direction: 'top'
    });
  });
  
  // Add zoom controls
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);
}

// Live feed with animations
function updateLiveFeed(feed) {
  const feedEl = document.getElementById('liveFeed');
  
  // Add new items with animation
  feed.forEach((item, index) => {
    setTimeout(() => {
      const li = document.createElement('li');
      li.className = item.type;
      li.innerHTML = `
        <strong>${formatTime(item.time)}</strong>
        <span>${item.message}</span>
      `;
      
      // Prepend to keep newest at top
      if (feedEl.firstChild) {
        feedEl.insertBefore(li, feedEl.firstChild);
      } else {
        feedEl.appendChild(li);
      }
      
      // Limit items
      if (feedEl.children.length > 20) {
        feedEl.removeChild(feedEl.lastChild);
      }
    }, index * 300); // Stagger animations
  });
}

// Helper: Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

// Load all dashboard data
async function loadDashboard() {
  try {
    // Load timeline data
    const timeline = await fetchJSON('/api/dashboard/timeline');
    updateTimelineChart(timeline);
    
    // Load attack types
    const types = await fetchJSON('/api/dashboard/typepie');
    updateTypePieChart(types);
    
    // Load top attackers
    const attackers = await fetchJSON('/api/dashboard/topattackers');
    updateTopAttackersChart(attackers);
    
    // Load map data
    const mapPoints = await fetchJSON('/api/dashboard/mappoints');
    // Convert map points to the format our updateMap function expects
    const mapData = mapPoints.map((point, index) => ({
      lat: point[0],
      lng: point[1],
      country: 'Unknown',  // Server doesn't provide country info
      count: 1            // Server doesn't provide count info
    }));
    updateMap(mapData);
    
    // Load live feed
    const feedData = await fetchJSON('/api/dashboard/livefeed');
    // Convert feed data to the format our updateLiveFeed function expects
    const feed = feedData.map(item => ({
      type: item.type || 'attack',
      time: item.time || new Date().toISOString(),
      message: `${item.type || 'Event'} from ${item.ip || 'unknown IP'}`
    }));
    updateLiveFeed(feed);
    
    // Update last updated timestamp
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
      const now = new Date();
      lastUpdatedEl.textContent = now.toLocaleTimeString();
    }
    
    // Success notification
    alertSystem.show({
      message: 'Dashboard updated successfully',
      type: 'success',
      timeout: 3000
    });
    
  } catch (error) {
    console.error('Dashboard load error:', error);
    alertSystem.show({
      message: 'Failed to load dashboard data',
      type: 'error',
      timeout: 5000
    });
  }
}

// Check if user is authenticated
async function checkAuthentication() {
  try {
    // Try to fetch a simple protected endpoint that we know exists
    // Using the dashboard timeline endpoint since we know it exists and requires auth
    const response = await fetch('/api/dashboard/timeline');
    
    if (response.status === 401 || response.status === 403) {
      // Not authenticated
      alertSystem.show({
        message: 'Please log in to view the dashboard',
        type: 'warning',
        timeout: 5000
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
      return false;
    }
    
    // Even if we get a 200 OK, we need to make sure it's actually JSON
    // This helps avoid the "Invalid response format" error
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      alertSystem.show({
        message: 'Server returned invalid data format. Please try again later.',
        type: 'error',
        timeout: 7000
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Setup mobile menu
  setupMobileMenu();
  
  // Setup dark mode toggle
  setupDarkModeToggle();
  
  // Check authentication before loading dashboard
  const isAuthenticated = await checkAuthentication();
  
  if (isAuthenticated) {
    // Load dashboard data
    loadDashboard();
    
    // Setup refresh button if it exists
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadDashboard();
      });
    }
    
    // Setup auto-refresh (every 5 minutes)
    setInterval(() => {
      loadDashboard();
    }, 5 * 60 * 1000);
  }
  
  // Add notification badge to live feed
  const feedLink = document.querySelector('.sidebar nav a:nth-child(2)');
  const badge = document.createElement('span');
  badge.className = 'notification-badge';
  badge.textContent = '3';
  feedLink.appendChild(badge);
});

/**
 * Ultra-Modern Alert System with Glassmorphism & Advanced Animations
 * Features:
 * - Glassmorphism UI with light/dark mode support
 * - Accessible (ARIA attributes, keyboard navigation)
 * - Auto-dismiss with progress bar
 * - Stacked notifications
 * - Mobile responsive
 * - Custom icons and animations
 */
(function() {
  // Icons for each alert type
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '!'
  };

  // Alert counter for unique IDs
  let alertCounter = 0;
  
  /**
   * Show an alert notification
   * @param {Object} options - Alert options
   * @param {string} options.message - Alert message text
   * @param {string} [options.type='info'] - Alert type: 'success', 'error', 'info', 'warning'
   * @param {number} [options.timeout=5000] - Auto-dismiss timeout in ms (0 for no auto-dismiss)
   * @param {string} [options.position='top-right'] - Position: 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'
   * @param {boolean} [options.dismissible=true] - Whether alert can be dismissed manually
   */
  function showAlert(options) {
    // Default options
    const config = Object.assign({
      message: 'Alert message',
      type: 'info',
      timeout: 5000,
      position: 'top-right',
      dismissible: true
    }, options);
    
    // Validate type
    if (!['success', 'error', 'info', 'warning'].includes(config.type)) {
      config.type = 'info';
    }
    
    // Create or get container
    let container = document.querySelector('.alert-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'alert-container';
      document.body.appendChild(container);
    }
    
    // Create alert element
    const alertId = `alert-${Date.now()}-${alertCounter++}`;
    const alert = document.createElement('div');
    alert.className = `alert ${config.type}`;
    alert.id = alertId;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'assertive');
    
    // Create alert content
    const alertContent = document.createElement('div');
    alertContent.className = 'alert-content';
    
    // Create icon
    const iconEl = document.createElement('span');
    iconEl.className = 'alert-icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = icons[config.type] || icons.info;
    
    // Create message
    const messageEl = document.createElement('p');
    messageEl.className = 'alert-text';
    messageEl.textContent = config.message;
    
    // Assemble alert
    alertContent.appendChild(iconEl);
    alertContent.appendChild(messageEl);
    alert.appendChild(alertContent);
    
    // Add close button if dismissible
    if (config.dismissible) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'alert-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close alert');
      closeBtn.setAttribute('type', 'button');
      
      closeBtn.addEventListener('click', () => dismissAlert(alert));
      alert.appendChild(closeBtn);
    }
    
    // Add to container
    container.appendChild(alert);
    
    // Auto-dismiss
    if (config.timeout > 0) {
      setTimeout(() => {
        if (document.body.contains(alert)) {
          dismissAlert(alert);
        }
      }, config.timeout);
    }
    
    // Return alert ID for potential manual dismissal
    return alertId;
  }
  
  /**
   * Dismiss an alert with animation
   * @param {HTMLElement} alert - The alert element to dismiss
   */
  function dismissAlert(alert) {
    // Add exit animation
    alert.style.animation = 'alertSlideOut 0.3s forwards';
    
    // Remove after animation completes
    setTimeout(() => {
      if (alert && alert.parentNode) {
        alert.parentNode.removeChild(alert);
        
        // Remove container if empty
        const container = document.querySelector('.alert-container');
        if (container && !container.hasChildNodes()) {
          container.remove();
        }
      }
    }, 300);
  }
  
  /**
   * Dismiss an alert by ID
   * @param {string} alertId - The ID of the alert to dismiss
   */
  function dismissAlertById(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) {
      dismissAlert(alert);
      return true;
    }
    return false;
  }
  
  /**
   * Dismiss all alerts
   */
  function dismissAllAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => dismissAlert(alert));
  }
  
  // Expose API to window
  window.alertSystem = {
    show: showAlert,
    dismiss: dismissAlertById,
    dismissAll: dismissAllAlerts
  };
})();

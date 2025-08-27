/**
 * Notification System Module
 * Professional stacked notification system for user feedback
 */

(function () {
  function showNotification(message, type = "info") {
    // Ensure container exists
    let container = document.querySelector(".notification-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "notification-container";
      document.body.appendChild(container);
    }

    // Create notification
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Close button handler
    notification.querySelector(".notification-close").addEventListener("click", () => {
      removeNotification(notification);
    });

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
  }

  function removeNotification(notification) {
    if (notification && notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "fa-check-circle";
      case "warning":
        return "fa-exclamation-triangle";
      case "error":
        return "fa-times-circle";
      default:
        return "fa-info-circle";
    }
  }

  function addNotificationStyles() {
    if (document.querySelector("#notification-styles")) return;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 1000;
        }
        .notification {
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        }
        .notification-success {
            background: rgba(11, 238, 162, 0.97);
            color: var(--success, #065f46);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .notification-warning {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning, #92400e);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .notification-error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--error, #991b1b);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .notification-info {
            background: rgba(236, 234, 71, 1);
            color: var(--info, #1e3a8a);
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .notification-content {
            display: flex;
            align-items: center;
            color: black;
            gap: 12px;
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 4px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .notification-close:hover {
            opacity: 1;
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
  }

  // Initialize styles
  addNotificationStyles();

  // Export
  window.notificationModule = { showNotification };
})();

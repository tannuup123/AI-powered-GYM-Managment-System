// Toast Notification Component

let toastContainer = null;

/**
 * Create toast container if it doesn't exist
 */
function ensureToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 4000) {
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

    // Add close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);

    return toast;
}

/**
 * Remove a toast with animation
 * @param {HTMLElement} toast 
 */
function removeToast(toast) {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Show success toast
 * @param {string} message 
 */
export function showSuccess(message) {
    return showToast(message, 'success');
}

/**
 * Show error toast
 * @param {string} message 
 */
export function showError(message) {
    return showToast(message, 'error');
}

/**
 * Show warning toast
 * @param {string} message 
 */
export function showWarning(message) {
    return showToast(message, 'warning');
}

/**
 * Show info toast
 * @param {string} message 
 */
export function showInfo(message) {
    return showToast(message, 'info');
}

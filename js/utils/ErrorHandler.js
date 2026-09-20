/**
 * ErrorHandler - Centralized error handling for the Shams Restaurant website
 * 
 * This class provides a unified approach to handling different types of errors
 * throughout the application, with appropriate user-facing messages and logging.
 * 
 * @class ErrorHandler
 * @version 1.0.0
 */

class ErrorHandler {
  /**
   * Error context constants for categorizing errors
   * @readonly
   * @enum {string}
   */
  static ErrorContext = {
    DATA_LOAD: 'DATA_LOAD',
    VALIDATION: 'VALIDATION',
    IMAGE_LOAD: 'IMAGE_LOAD',
    LANGUAGE: 'LANGUAGE',
    STORAGE: 'STORAGE',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN'
  };

  /**
   * Create an ErrorHandler instance
   * @param {Object} options - Configuration options
   * @param {boolean} [options.enableToast=true] - Enable toast notifications for errors
   * @param {boolean} [options.enableConsoleLog=true] - Enable console logging
   * @param {Function} [options.monitoringCallback=null] - Callback for external error monitoring
   */
  constructor(options = {}) {
    this.enableToast = options.enableToast !== false;
    this.enableConsoleLog = options.enableConsoleLog !== false;
    this.monitoringCallback = options.monitoringCallback || null;
    this.errorLog = [];
  }

  /**
   * Handle error with user-friendly message
   * @param {Error} error - Error object
   * @param {string} context - Error context from ErrorContext enum
   * @param {Object} [additionalData={}] - Additional context data for logging
   */
  handle(error, context, additionalData = {}) {
    // Log error details
    if (this.enableConsoleLog) {
      console.error(`[${context}]`, error);
      if (Object.keys(additionalData).length > 0) {
        console.error('Additional context:', additionalData);
      }
    }

    // Store error in internal log
    this.logError(error, context, additionalData);

    // Display user-friendly message based on context
    const message = this.getUserMessage(context);
    if (this.enableToast) {
      this.showUserMessage(message);
    }

    // Send to external monitoring service if configured
    this.logToMonitoring(error, context, additionalData);
  }

  /**
   * Get appropriate user-friendly message for error context
   * @param {string} context - Error context
   * @returns {string} User-friendly error message
   * @private
   */
  getUserMessage(context) {
    switch (context) {
      case ErrorHandler.ErrorContext.DATA_LOAD:
        return 'Unable to load menu data. Please refresh the page.';
      
      case ErrorHandler.ErrorContext.VALIDATION:
        return 'Some menu items are incomplete.';
      
      case ErrorHandler.ErrorContext.IMAGE_LOAD:
        // Silent fail - images have fallbacks
        return '';
      
      case ErrorHandler.ErrorContext.LANGUAGE:
        return 'Language switch failed. Please try again.';
      
      case ErrorHandler.ErrorContext.STORAGE:
        // Warning only - app continues to work
        console.warn('LocalStorage unavailable. Preferences won\'t be saved.');
        return '';
      
      case ErrorHandler.ErrorContext.NETWORK:
        return 'Network error. Please check your connection.';
      
      default:
        return 'An unexpected error occurred.';
    }
  }

  /**
   * Show user-friendly error message via toast notification
   * @param {string} message - Message to display
   * @private
   */
  showUserMessage(message) {
    if (!message) return;

    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.textContent = message;

    // Apply styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      zIndex: '9999',
      fontSize: '14px',
      fontWeight: '500',
      maxWidth: '320px',
      animation: 'slideInUp 0.3s ease-out'
    });

    // Add to DOM
    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }

  /**
   * Log error to internal error log
   * @param {Error} error - Error object
   * @param {string} context - Error context
   * @param {Object} additionalData - Additional context data
   * @private
   */
  logError(error, context, additionalData) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack,
      additionalData,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errorLog.push(errorEntry);

    // Keep only last 50 errors in memory
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }
  }

  /**
   * Log error to external monitoring service
   * @param {Error} error - Error object
   * @param {string} context - Error context
   * @param {Object} additionalData - Additional context data
   * @private
   */
  logToMonitoring(error, context, additionalData) {
    if (typeof this.monitoringCallback === 'function') {
      try {
        this.monitoringCallback({
          error,
          context,
          additionalData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      } catch (monitoringError) {
        console.error('Failed to send error to monitoring service:', monitoringError);
      }
    }
  }

  /**
   * Get all logged errors
   * @returns {Array} Array of error entries
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Create a promise wrapper that automatically handles errors
   * @param {Promise} promise - Promise to wrap
   * @param {string} context - Error context
   * @param {Object} [additionalData={}] - Additional context data
   * @returns {Promise} Wrapped promise
   */
  async wrapPromise(promise, context, additionalData = {}) {
    try {
      return await promise;
    } catch (error) {
      this.handle(error, context, additionalData);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }

  /**
   * Handle image load error with fallback
   * @param {HTMLImageElement} img - Image element that failed to load
   * @param {string} [fallbackSrc=''] - Optional fallback image source
   */
  handleImageError(img, fallbackSrc = '') {
    if (this.enableConsoleLog) {
      console.warn(`Image failed to load: ${img.src}`);
    }

    this.logError(
      new Error(`Image load failure: ${img.src}`),
      ErrorHandler.ErrorContext.IMAGE_LOAD,
      { originalSrc: img.src }
    );

    // Set fallback image if provided
    if (fallbackSrc) {
      img.src = fallbackSrc;
      img.alt = img.alt || 'Image not available';
    } else {
      // Hide image and show placeholder
      img.style.display = 'none';
      
      // Create placeholder element
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', img.alt || 'Image not available');
      
      Object.assign(placeholder.style, {
        width: '100%',
        height: '100%',
        backgroundColor: '#1F2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6B7280',
        fontSize: '14px'
      });
      
      placeholder.textContent = '📷';
      
      if (img.parentNode) {
        img.parentNode.insertBefore(placeholder, img);
      }
    }
  }

  /**
   * Setup global error handlers
   * @static
   */
  static setupGlobalHandlers() {
    const handler = new ErrorHandler();

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      handler.handle(
        event.error || new Error(event.message),
        ErrorHandler.ErrorContext.UNKNOWN,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      handler.handle(
        new Error(event.reason),
        ErrorHandler.ErrorContext.UNKNOWN,
        { reason: event.reason }
      );
    });

    return handler;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}

/**
 * Professional Layout and Breakpoint System for Shams Restaurant Website
 * 
 * Defines responsive breakpoints, container widths, grid columns, and layout configuration.
 */

export const LAYOUT = {
  // Breakpoints
  breakpoints: {
    mobile: '0px',       // 0-767px
    tablet: '768px',     // 768-1023px
    desktop: '1024px',   // 1024-1439px
    wide: '1440px'       // 1440px+
  },

  // Media query strings
  mediaQueries: {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    wide: '(min-width: 1440px)',
    tabletAndAbove: '(min-width: 768px)',
    desktopAndAbove: '(min-width: 1024px)',
    highDPI: '(min-resolution: 2dppx)'
  },

  // Container widths
  container: {
    mobile: '100%',      // Full width with padding
    tablet: '720px',
    desktop: '1200px',
    wide: '1440px'
  },

  // Grid columns
  columns: {
    mobile: 1,           // Single column
    tablet: 2,           // Two columns
    desktop: 3,          // Three columns
    wide: 4              // Four columns (dish grid)
  },

  // Grid gaps
  gap: {
    mobile: '16px',
    tablet: '20px',
    desktop: '24px'
  }
};

/**
 * Responsive breakpoint values in pixels
 */
export const BREAKPOINT_VALUES = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

/**
 * Get the current breakpoint based on window width
 * @param {number} [width] - Window width (defaults to window.innerWidth)
 * @returns {string} Current breakpoint name (mobile, tablet, desktop, wide)
 */
export function getCurrentBreakpoint(width = window.innerWidth) {
  if (width >= BREAKPOINT_VALUES.wide) {
    return 'wide';
  } else if (width >= BREAKPOINT_VALUES.desktop) {
    return 'desktop';
  } else if (width >= BREAKPOINT_VALUES.tablet) {
    return 'tablet';
  } else {
    return 'mobile';
  }
}

/**
 * Check if current viewport matches a media query
 * @param {string} query - Media query name or custom media query string
 * @returns {boolean} True if matches
 */
export function matchesMediaQuery(query) {
  const mediaQuery = LAYOUT.mediaQueries[query] || query;
  return window.matchMedia(mediaQuery).matches;
}

/**
 * Add listener for breakpoint changes
 * @param {string} breakpoint - Breakpoint name (mobile, tablet, desktop, wide)
 * @param {Function} callback - Callback function to execute on match
 * @returns {MediaQueryList} Media query list object
 */
export function onBreakpointChange(breakpoint, callback) {
  const mediaQuery = LAYOUT.mediaQueries[breakpoint];
  if (!mediaQuery) {
    console.warn(`Breakpoint "${breakpoint}" not found`);
    return null;
  }

  const mql = window.matchMedia(mediaQuery);
  
  // Modern API
  if (mql.addEventListener) {
    mql.addEventListener('change', callback);
  } else {
    // Fallback for older browsers
    mql.addListener(callback);
  }

  // Call immediately if matches
  if (mql.matches) {
    callback(mql);
  }

  return mql;
}

/**
 * Get appropriate grid columns for current breakpoint
 * @param {string} [breakpoint] - Breakpoint name (auto-detected if not provided)
 * @returns {number} Number of columns
 */
export function getGridColumns(breakpoint) {
  const bp = breakpoint || getCurrentBreakpoint();
  return LAYOUT.columns[bp] || LAYOUT.columns.mobile;
}

/**
 * Get appropriate grid gap for current breakpoint
 * @param {string} [breakpoint] - Breakpoint name (auto-detected if not provided)
 * @returns {string} Gap value
 */
export function getGridGap(breakpoint) {
  const bp = breakpoint || getCurrentBreakpoint();
  return LAYOUT.gap[bp] || LAYOUT.gap.mobile;
}

/**
 * Get container width for current breakpoint
 * @param {string} [breakpoint] - Breakpoint name (auto-detected if not provided)
 * @returns {string} Container width
 */
export function getContainerWidth(breakpoint) {
  const bp = breakpoint || getCurrentBreakpoint();
  return LAYOUT.container[bp] || LAYOUT.container.mobile;
}

/**
 * Generate CSS custom properties for the layout system
 * @returns {string} CSS custom properties as a string
 */
export function generateLayoutCSSProperties() {
  const properties = [];

  // Breakpoints
  for (const [key, value] of Object.entries(LAYOUT.breakpoints)) {
    properties.push(`--breakpoint-${key}: ${value};`);
  }

  // Container widths
  for (const [key, value] of Object.entries(LAYOUT.container)) {
    properties.push(`--container-${key}: ${value};`);
  }

  // Grid gaps
  for (const [key, value] of Object.entries(LAYOUT.gap)) {
    properties.push(`--grid-gap-${key}: ${value};`);
  }

  return properties.join('\n    ');
}

/**
 * Inject layout system as CSS custom properties into the document
 */
export function injectLayoutSystem() {
  const style = document.createElement('style');
  style.id = 'design-system-layout';
  style.textContent = `:root {\n    ${generateLayoutCSSProperties()}\n  }`;
  document.head.appendChild(style);
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile
 */
export function isMobile() {
  return matchesMediaQuery('mobile');
}

/**
 * Check if device is tablet
 * @returns {boolean} True if tablet
 */
export function isTablet() {
  return matchesMediaQuery('tablet');
}

/**
 * Check if device is desktop
 * @returns {boolean} True if desktop or wider
 */
export function isDesktop() {
  return matchesMediaQuery('desktop');
}

/**
 * Check if device has high DPI display (Retina)
 * @returns {boolean} True if high DPI
 */
export function isHighDPI() {
  return matchesMediaQuery('highDPI');
}

// Default export
export default LAYOUT;

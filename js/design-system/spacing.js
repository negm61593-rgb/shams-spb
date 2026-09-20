/**
 * Professional Spacing System for Shams Restaurant Website
 * 
 * A consistent spacing system creates visual rhythm and improves scannability.
 * Base unit: 4px
 */

export const SPACING = {
  // Base unit: 4px
  '0.5': '2px',    // Minimal spacing (borders, tight gaps)
  '1': '4px',      // Very tight spacing
  '2': '8px',      // Compact spacing
  '3': '12px',     // Small spacing
  '4': '16px',     // Default spacing (base unit × 4)
  '5': '20px',     // Medium spacing
  '6': '24px',     // Standard spacing
  '8': '32px',     // Large spacing
  '10': '40px',    // X-large spacing
  '12': '48px',    // Section spacing
  '16': '64px',    // Major section spacing
  '20': '80px',    // Hero section spacing
  '24': '96px'     // Maximum section spacing
};

/**
 * Spacing application guidelines
 */
export const SPACING_GUIDELINES = {
  // Component Padding
  componentPadding: {
    buttons: {
      vertical: SPACING['3'],    // 12px
      horizontal: SPACING['6']   // 24px
    },
    cards: {
      mobile: SPACING['5'],      // 20px
      desktop: SPACING['6']      // 24px
    },
    modal: SPACING['8'],         // 32px
    pageContainer: {
      mobile: SPACING['4'],      // 16px
      desktop: SPACING['8']      // 32px
    }
  },

  // Component Gaps
  componentGaps: {
    gridColumns: SPACING['5'],   // 20px
    buttonGroups: SPACING['3'],  // 12px
    iconText: SPACING['2'],      // 8px
    formFields: SPACING['4']     // 16px
  },

  // Section Spacing
  sectionSpacing: {
    majorSections: {
      mobile: SPACING['12'],     // 48px
      desktop: SPACING['16']     // 64px
    },
    subsections: SPACING['8'],   // 32px
    relatedElements: SPACING['4'], // 16px
    textBlocks: SPACING['3']     // 12px
  },

  // Container Max-Widths
  containerMaxWidths: {
    fullWidth: '1440px',
    content: '1200px',
    text: '720px',
    form: '480px'
  }
};

/**
 * Generate CSS custom properties for the spacing system
 * @returns {string} CSS custom properties as a string
 */
export function generateSpacingCSSProperties() {
  const properties = [];
  
  for (const [key, value] of Object.entries(SPACING)) {
    properties.push(`--spacing-${key}: ${value};`);
  }
  
  return properties.join('\n    ');
}

/**
 * Inject spacing system as CSS custom properties into the document
 */
export function injectSpacingSystem() {
  const style = document.createElement('style');
  style.id = 'design-system-spacing';
  style.textContent = `:root {\n    ${generateSpacingCSSProperties()}\n  }`;
  document.head.appendChild(style);
}

/**
 * Get spacing value by key
 * @param {string} key - Spacing key (e.g., '0.5', '1', '2', etc.)
 * @returns {string} Spacing value in pixels
 */
export function getSpacing(key) {
  return SPACING[key] || SPACING['4']; // Default to base spacing if key not found
}

// Default export
export default SPACING;

/**
 * Design System Entry Point
 * 
 * Unified interface for accessing all design tokens (colors, spacing, typography, layout)
 * and utility functions for the Shams Restaurant website.
 */

import { 
  COLOR_SYSTEM, 
  generateColorCSSProperties, 
  injectColorSystem 
} from './colors.js';

import { 
  SPACING, 
  SPACING_GUIDELINES, 
  generateSpacingCSSProperties, 
  injectSpacingSystem, 
  getSpacing 
} from './spacing.js';

import { 
  TYPOGRAPHY, 
  FONT_FAMILIES, 
  TYPOGRAPHY_PRESETS, 
  ARABIC_ADJUSTMENTS, 
  generateTypographyCSSProperties, 
  injectTypographySystem, 
  applyTypographyPreset 
} from './typography.js';

import { 
  LAYOUT, 
  BREAKPOINT_VALUES, 
  getCurrentBreakpoint, 
  matchesMediaQuery, 
  onBreakpointChange, 
  getGridColumns, 
  getGridGap, 
  getContainerWidth, 
  generateLayoutCSSProperties, 
  injectLayoutSystem, 
  isMobile, 
  isTablet, 
  isDesktop, 
  isHighDPI 
} from './breakpoints.js';

/**
 * Complete design system object
 */
export const DesignSystem = {
  colors: COLOR_SYSTEM,
  spacing: SPACING,
  spacingGuidelines: SPACING_GUIDELINES,
  typography: TYPOGRAPHY,
  fontFamilies: FONT_FAMILIES,
  typographyPresets: TYPOGRAPHY_PRESETS,
  arabicAdjustments: ARABIC_ADJUSTMENTS,
  layout: LAYOUT,
  breakpoints: BREAKPOINT_VALUES
};

/**
 * Initialize the complete design system by injecting all CSS custom properties
 * Call this function once when the page loads to make design tokens available as CSS variables
 */
export function initializeDesignSystem() {
  injectColorSystem();
  injectSpacingSystem();
  injectTypographySystem();
  injectLayoutSystem();
  
  console.log('🎨 Design system initialized');
}

/**
 * Generate all CSS custom properties as a single string
 * @returns {string} Complete CSS custom properties
 */
export function generateAllCSSProperties() {
  return `
:root {
  /* Colors */
  ${generateColorCSSProperties()}

  /* Spacing */
  ${generateSpacingCSSProperties()}

  /* Typography */
  ${generateTypographyCSSProperties()}

  /* Layout */
  ${generateLayoutCSSProperties()}
}
  `.trim();
}

/**
 * Export all CSS custom properties to a file (for static CSS generation)
 * @returns {string} CSS file content
 */
export function exportDesignSystemCSS() {
  return `/**
 * Design System CSS Custom Properties
 * Auto-generated from design system tokens
 * 
 * Usage: Include this file in your HTML or import in your CSS
 */

${generateAllCSSProperties()}

/* Font Family Application */
body {
  font-family: var(--font-primary);
}

html[lang="ar"] body,
html[dir="rtl"] body {
  font-family: var(--font-arabic);
}

code, pre {
  font-family: var(--font-monospace);
}
`;
}

// Re-export individual modules for direct access
export { 
  COLOR_SYSTEM, 
  injectColorSystem 
} from './colors.js';

export { 
  SPACING, 
  SPACING_GUIDELINES, 
  injectSpacingSystem, 
  getSpacing 
} from './spacing.js';

export { 
  TYPOGRAPHY, 
  FONT_FAMILIES, 
  TYPOGRAPHY_PRESETS, 
  ARABIC_ADJUSTMENTS, 
  injectTypographySystem, 
  applyTypographyPreset 
} from './typography.js';

export { 
  LAYOUT, 
  BREAKPOINT_VALUES, 
  getCurrentBreakpoint, 
  matchesMediaQuery, 
  onBreakpointChange, 
  getGridColumns, 
  getGridGap, 
  getContainerWidth, 
  injectLayoutSystem, 
  isMobile, 
  isTablet, 
  isDesktop, 
  isHighDPI 
} from './breakpoints.js';

// Default export
export default DesignSystem;

/**
 * Professional Typography System for Shams Restaurant Website
 * 
 * A clear typographic hierarchy improves readability and guides user attention.
 */

export const TYPOGRAPHY = {
  // Font Size Scale
  fontSize: {
    xs: '12px',      // Metadata, tags, very small text
    sm: '14px',      // Supporting text, captions
    base: '16px',    // Body text (baseline)
    lg: '18px',      // Emphasized body, lead paragraphs
    xl: '20px',      // H4 headings
    '2xl': '24px',   // H3 headings
    '3xl': '30px',   // H2 headings
    '4xl': '36px',   // H1 headings (mobile)
    '5xl': '48px',   // H1 headings (tablet)
    '6xl': '60px'    // H1 headings (desktop), hero text
  },

  // Font Weight Scale
  fontWeight: {
    normal: 400,     // Body text
    medium: 500,     // Emphasized text
    semibold: 600,   // Subheadings
    bold: 700,       // Headings
    extrabold: 800,  // Major headings
    black: 900       // Hero text, brand text
  },

  // Line Height Scale
  lineHeight: {
    tight: 1.2,      // Large headings
    snug: 1.35,      // Smaller headings
    normal: 1.5,     // Body text
    relaxed: 1.625,  // Comfortable reading
    loose: 1.75      // Spacious paragraphs (Arabic text)
  },

  // Letter Spacing Scale
  letterSpacing: {
    tighter: '-0.02em',  // Large headings
    tight: '-0.01em',    // Headings
    normal: '0',         // Body text
    wide: '0.025em',     // All-caps text
    wider: '0.05em'      // Widely spaced all-caps
  }
};

/**
 * Font family stacks
 */
export const FONT_FAMILIES = {
  primary: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  arabic: "'Cairo', 'Montserrat', sans-serif",
  monospace: "'SF Mono', Monaco, 'Cascadia Code', monospace"
};

/**
 * Typography presets for common elements
 */
export const TYPOGRAPHY_PRESETS = {
  h1: {
    mobile: {
      fontSize: TYPOGRAPHY.fontSize['4xl'],    // 36px
      fontWeight: TYPOGRAPHY.fontWeight.black, // 900
      lineHeight: TYPOGRAPHY.lineHeight.tight, // 1.2
      letterSpacing: TYPOGRAPHY.letterSpacing.tighter, // -0.02em
      marginBottom: '16px'
    },
    tablet: {
      fontSize: TYPOGRAPHY.fontSize['5xl']     // 48px
    },
    desktop: {
      fontSize: TYPOGRAPHY.fontSize['6xl']     // 60px
    }
  },

  h2: {
    mobile: {
      fontSize: TYPOGRAPHY.fontSize['2xl'],      // 24px
      fontWeight: TYPOGRAPHY.fontWeight.extrabold, // 800
      lineHeight: TYPOGRAPHY.lineHeight.snug,    // 1.3
      letterSpacing: TYPOGRAPHY.letterSpacing.tight, // -0.01em
      marginBottom: '12px'
    },
    desktop: {
      fontSize: TYPOGRAPHY.fontSize['3xl']       // 30px
    }
  },

  h3: {
    mobile: {
      fontSize: TYPOGRAPHY.fontSize.xl,        // 20px
      fontWeight: TYPOGRAPHY.fontWeight.bold,  // 700
      lineHeight: TYPOGRAPHY.lineHeight.snug,  // 1.35
      marginBottom: '8px'
    },
    desktop: {
      fontSize: TYPOGRAPHY.fontSize['2xl']     // 24px
    }
  },

  body: {
    fontSize: TYPOGRAPHY.fontSize.base,        // 16px
    fontWeight: TYPOGRAPHY.fontWeight.normal,  // 400
    lineHeight: TYPOGRAPHY.lineHeight.relaxed, // 1.625
    marginBottom: '12px'
  },

  small: {
    fontSize: TYPOGRAPHY.fontSize.sm,          // 14px
    lineHeight: TYPOGRAPHY.lineHeight.normal   // 1.5
  },

  meta: {
    fontSize: TYPOGRAPHY.fontSize.xs,          // 12px
    fontWeight: TYPOGRAPHY.fontWeight.semibold, // 600
    lineHeight: TYPOGRAPHY.lineHeight.normal,  // 1.5
    letterSpacing: TYPOGRAPHY.letterSpacing.wide, // 0.025em
    textTransform: 'uppercase'
  }
};

/**
 * Arabic text adjustments
 */
export const ARABIC_ADJUSTMENTS = {
  h1: {
    lineHeight: 1.28,
    letterSpacing: '-0.01em'
  },
  h2: {
    lineHeight: 1.38
  },
  h3: {
    lineHeight: 1.38
  },
  body: {
    lineHeight: 1.7
  }
};

/**
 * Generate CSS custom properties for the typography system
 * @returns {string} CSS custom properties as a string
 */
export function generateTypographyCSSProperties() {
  const properties = [];

  // Font families
  properties.push(`--font-primary: ${FONT_FAMILIES.primary};`);
  properties.push(`--font-arabic: ${FONT_FAMILIES.arabic};`);
  properties.push(`--font-monospace: ${FONT_FAMILIES.monospace};`);

  // Font sizes
  for (const [key, value] of Object.entries(TYPOGRAPHY.fontSize)) {
    properties.push(`--font-size-${key}: ${value};`);
  }

  // Font weights
  for (const [key, value] of Object.entries(TYPOGRAPHY.fontWeight)) {
    properties.push(`--font-weight-${key}: ${value};`);
  }

  // Line heights
  for (const [key, value] of Object.entries(TYPOGRAPHY.lineHeight)) {
    properties.push(`--line-height-${key}: ${value};`);
  }

  // Letter spacing
  for (const [key, value] of Object.entries(TYPOGRAPHY.letterSpacing)) {
    properties.push(`--letter-spacing-${key}: ${value};`);
  }

  return properties.join('\n    ');
}

/**
 * Inject typography system as CSS custom properties into the document
 */
export function injectTypographySystem() {
  const style = document.createElement('style');
  style.id = 'design-system-typography';
  style.textContent = `:root {\n    ${generateTypographyCSSProperties()}\n  }`;
  document.head.appendChild(style);
}

/**
 * Apply typography preset to an element
 * @param {HTMLElement} element - Element to apply typography to
 * @param {string} preset - Preset name (h1, h2, h3, body, small, meta)
 * @param {string} [breakpoint='mobile'] - Breakpoint (mobile, tablet, desktop)
 */
export function applyTypographyPreset(element, preset, breakpoint = 'mobile') {
  const presetConfig = TYPOGRAPHY_PRESETS[preset];
  if (!presetConfig) {
    console.warn(`Typography preset "${preset}" not found`);
    return;
  }

  const config = presetConfig[breakpoint] || presetConfig.mobile || presetConfig;
  
  Object.entries(config).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

// Default export
export default TYPOGRAPHY;

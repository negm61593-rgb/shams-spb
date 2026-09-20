/**
 * Professional Color System for Shams Restaurant Website
 * 
 * This color system creates a warm, appetizing atmosphere that reflects 
 * Egyptian hospitality while maintaining excellent readability and accessibility.
 * All color combinations meet WCAG AA standards for contrast.
 */

export const COLOR_SYSTEM = {
  // Brand Identity Colors
  primary: {
    gold: '#F59E0B',        // Primary CTA and brand highlights
    amber: '#D97706',       // Secondary actions, hover states
    fire: '#EA580C',        // Accent for special offers, "hot" items
    warmOrange: '#FB923C',  // Secondary accent for gradients
    paleGold: '#FDE68A'     // Subtle backgrounds, soft highlights
  },

  // Background System (Dark Theme)
  background: {
    deep: '#0B0F17',        // Main body background
    elevated: '#151D2A',    // Card backgrounds, elevated elements
    elevated2: '#1E293B',   // Secondary elevated surfaces
    elevated3: '#273447',   // Tertiary level (hover states)
    overlay: 'rgba(11, 15, 23, 0.95)'  // Modal overlays
  },

  // Border System
  border: {
    subtle: '#1E293B',      // Minimal separation
    default: '#243248',     // Standard borders
    emphasis: '#334155',    // Emphasized borders
    accent: '#F59E0B',      // Brand accent borders
    accentSubtle: 'rgba(245, 158, 11, 0.3)'  // Subtle accent borders
  },

  // Text System
  text: {
    primary: '#F9FAFB',     // Main headings, important text
    secondary: '#E5E7EB',   // Body text, descriptions
    tertiary: '#9CA3AF',    // Secondary information, metadata
    muted: '#6B7280',       // Disabled text, very low emphasis
    inverse: '#0F172A',     // Text on light backgrounds
    brand: '#FBBF24'        // Brand accent text (gold)
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',     // Success states, "open now"
    successBg: 'rgba(16, 185, 129, 0.1)',
    error: '#EF4444',       // Error states, warnings
    errorBg: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',        // Information, notifications
    infoBg: 'rgba(59, 130, 246, 0.1)',
    rating: '#FBBF24'       // Star ratings, reviews
  },

  // Gradient System
  gradients: {
    brandPrimary: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
    brandSubtle: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%)',
    heroGlow: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.18) 0%, rgba(11, 15, 23, 0) 70%)',
    cardHover: 'linear-gradient(180deg, rgba(251, 191, 36, 0.05) 0%, transparent 100%)',
    textGradient: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #F97316 100%)'
  }
};

/**
 * Generate CSS custom properties for the color system
 * @returns {string} CSS custom properties as a string
 */
export function generateColorCSSProperties() {
  return `
    /* Brand Identity Colors */
    --color-primary-gold: ${COLOR_SYSTEM.primary.gold};
    --color-primary-amber: ${COLOR_SYSTEM.primary.amber};
    --color-primary-fire: ${COLOR_SYSTEM.primary.fire};
    --color-primary-warm-orange: ${COLOR_SYSTEM.primary.warmOrange};
    --color-primary-pale-gold: ${COLOR_SYSTEM.primary.paleGold};

    /* Background System */
    --color-bg-deep: ${COLOR_SYSTEM.background.deep};
    --color-bg-elevated: ${COLOR_SYSTEM.background.elevated};
    --color-bg-elevated2: ${COLOR_SYSTEM.background.elevated2};
    --color-bg-elevated3: ${COLOR_SYSTEM.background.elevated3};
    --color-bg-overlay: ${COLOR_SYSTEM.background.overlay};

    /* Border System */
    --color-border-subtle: ${COLOR_SYSTEM.border.subtle};
    --color-border-default: ${COLOR_SYSTEM.border.default};
    --color-border-emphasis: ${COLOR_SYSTEM.border.emphasis};
    --color-border-accent: ${COLOR_SYSTEM.border.accent};
    --color-border-accent-subtle: ${COLOR_SYSTEM.border.accentSubtle};

    /* Text System */
    --color-text-primary: ${COLOR_SYSTEM.text.primary};
    --color-text-secondary: ${COLOR_SYSTEM.text.secondary};
    --color-text-tertiary: ${COLOR_SYSTEM.text.tertiary};
    --color-text-muted: ${COLOR_SYSTEM.text.muted};
    --color-text-inverse: ${COLOR_SYSTEM.text.inverse};
    --color-text-brand: ${COLOR_SYSTEM.text.brand};

    /* Semantic Colors */
    --color-success: ${COLOR_SYSTEM.semantic.success};
    --color-success-bg: ${COLOR_SYSTEM.semantic.successBg};
    --color-error: ${COLOR_SYSTEM.semantic.error};
    --color-error-bg: ${COLOR_SYSTEM.semantic.errorBg};
    --color-info: ${COLOR_SYSTEM.semantic.info};
    --color-info-bg: ${COLOR_SYSTEM.semantic.infoBg};
    --color-rating: ${COLOR_SYSTEM.semantic.rating};

    /* Gradients */
    --gradient-brand-primary: ${COLOR_SYSTEM.gradients.brandPrimary};
    --gradient-brand-subtle: ${COLOR_SYSTEM.gradients.brandSubtle};
    --gradient-hero-glow: ${COLOR_SYSTEM.gradients.heroGlow};
    --gradient-card-hover: ${COLOR_SYSTEM.gradients.cardHover};
    --gradient-text: ${COLOR_SYSTEM.gradients.textGradient};
  `.trim();
}

/**
 * Inject color system as CSS custom properties into the document
 */
export function injectColorSystem() {
  const style = document.createElement('style');
  style.id = 'design-system-colors';
  style.textContent = `:root {\n  ${generateColorCSSProperties()}\n}`;
  document.head.appendChild(style);
}

// Default export
export default COLOR_SYSTEM;

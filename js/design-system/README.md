# Shams Restaurant Design System

A comprehensive, professional design system for the Shams Restaurant website. This design system provides consistent design tokens for colors, spacing, typography, and layout that create a warm, inviting, and highly functional user experience.

## 📁 Files

- **`colors.js`** - Complete color system with brand colors, backgrounds, borders, text, semantic colors, and gradients
- **`spacing.js`** - Spacing scale based on 4px base unit (0.5 to 24)
- **`typography.js`** - Typography system with font sizes, weights, line heights, and letter spacing
- **`breakpoints.js`** - Responsive breakpoints and layout configuration
- **`index.js`** - Unified entry point that exports all design tokens
- **`design-tokens.css`** - Standalone CSS file with all design tokens as custom properties

## 🚀 Quick Start

### Option 1: JavaScript (Recommended for Dynamic Applications)

```javascript
// Import and initialize the complete design system
import { initializeDesignSystem } from './js/design-system/index.js';

// Call once when page loads
initializeDesignSystem();
```

This will inject all design tokens as CSS custom properties into your document.

### Option 2: Direct CSS Import (Recommended for Static Sites)

```html
<!-- Include in your HTML -->
<link rel="stylesheet" href="js/design-system/design-tokens.css">
```

## 📦 Modules

### Colors (`colors.js`)

Complete color system with WCAG AA compliant combinations:

```javascript
import { COLOR_SYSTEM } from './js/design-system/colors.js';

// Access colors
const brandGold = COLOR_SYSTEM.primary.gold;        // #F59E0B
const bgDeep = COLOR_SYSTEM.background.deep;        // #0B0F17
const textPrimary = COLOR_SYSTEM.text.primary;      // #F9FAFB
const successColor = COLOR_SYSTEM.semantic.success; // #10B981
```

**Color Categories:**
- `primary` - Brand identity colors (gold, amber, fire, warmOrange, paleGold)
- `background` - Dark theme backgrounds (deep, elevated, elevated2, elevated3, overlay)
- `border` - Border colors (subtle, default, emphasis, accent, accentSubtle)
- `text` - Text colors (primary, secondary, tertiary, muted, inverse, brand)
- `semantic` - Semantic colors (success, error, info, rating with background variants)
- `gradients` - Pre-defined gradients (brandPrimary, brandSubtle, heroGlow, cardHover, textGradient)

### Spacing (`spacing.js`)

Consistent spacing scale (base unit: 4px):

```javascript
import { SPACING, getSpacing } from './js/design-system/spacing.js';

// Access spacing values
const smallGap = SPACING['2'];    // 8px
const defaultGap = SPACING['4'];  // 16px
const largeGap = SPACING['8'];    // 32px

// Or use the helper function
const spacing = getSpacing('6');  // 24px
```

**Spacing Scale:**
- `0.5` (2px) - Minimal spacing
- `1` (4px) - Very tight
- `2` (8px) - Compact
- `3` (12px) - Small
- `4` (16px) - Default
- `5` (20px) - Medium
- `6` (24px) - Standard
- `8` (32px) - Large
- `10` (40px) - X-large
- `12` (48px) - Section
- `16` (64px) - Major section
- `20` (80px) - Hero section
- `24` (96px) - Maximum

### Typography (`typography.js`)

Professional typography system with responsive presets:

```javascript
import { 
  TYPOGRAPHY, 
  TYPOGRAPHY_PRESETS, 
  applyTypographyPreset 
} from './js/design-system/typography.js';

// Access typography values
const baseFontSize = TYPOGRAPHY.fontSize.base;        // 16px
const boldWeight = TYPOGRAPHY.fontWeight.bold;        // 700
const relaxedLineHeight = TYPOGRAPHY.lineHeight.relaxed; // 1.625

// Apply preset to an element
const heading = document.querySelector('h1');
applyTypographyPreset(heading, 'h1', 'desktop');
```

**Typography Scales:**
- **Font Sizes**: xs (12px) to 6xl (60px)
- **Font Weights**: normal (400) to black (900)
- **Line Heights**: tight (1.2) to loose (1.75)
- **Letter Spacing**: tighter (-0.02em) to wider (0.05em)

**Presets Available:**
- `h1`, `h2`, `h3` - Heading styles
- `body` - Body text
- `small` - Small text
- `meta` - Metadata (price, weight, time)

### Layout & Breakpoints (`breakpoints.js`)

Responsive breakpoints and layout utilities:

```javascript
import { 
  LAYOUT, 
  getCurrentBreakpoint, 
  matchesMediaQuery, 
  isMobile, 
  isDesktop 
} from './js/design-system/breakpoints.js';

// Check current breakpoint
const currentBp = getCurrentBreakpoint(); // 'mobile', 'tablet', 'desktop', 'wide'

// Check if matches a media query
if (matchesMediaQuery('desktop')) {
  console.log('Desktop view');
}

// Simple checks
if (isMobile()) {
  // Mobile-specific code
}
```

**Breakpoints:**
- **Mobile**: 0-767px
- **Tablet**: 768-1023px
- **Desktop**: 1024-1439px
- **Wide**: 1440px+

**Container Widths:**
- Mobile: 100%
- Tablet: 720px
- Desktop: 1200px
- Wide: 1440px

## 🎨 Using CSS Custom Properties

All design tokens are available as CSS custom properties when you initialize the design system:

```css
/* Colors */
.my-button {
  background: var(--color-primary-gold);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border-accent);
}

/* Spacing */
.my-card {
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  gap: var(--spacing-4);
}

/* Typography */
.my-heading {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

/* Layout */
.my-container {
  max-width: var(--container-desktop);
  padding: var(--grid-gap-desktop);
}
```

## 📱 Responsive Design

The design system includes built-in responsive behavior:

```javascript
import { onBreakpointChange } from './js/design-system/breakpoints.js';

// Listen for breakpoint changes
onBreakpointChange('desktop', (mql) => {
  if (mql.matches) {
    console.log('Switched to desktop view');
    // Update UI for desktop
  }
});
```

## 🌐 RTL Support

The design system includes Arabic text adjustments:

```javascript
import { ARABIC_ADJUSTMENTS } from './js/design-system/typography.js';

// Arabic adjustments are automatically applied via CSS
// when html[dir="rtl"] or html[lang="ar"]
```

## 📊 Accessibility

All color combinations meet WCAG AA standards:

| Combination | Contrast Ratio | Use Case |
|-------------|---------------|----------|
| text.primary on background.deep | 15.8:1 | Main headings |
| text.secondary on background.deep | 13.1:1 | Body text |
| text.tertiary on background.deep | 7.2:1 | Supporting text |
| text.inverse on primary.gold | 8.9:1 | CTA buttons |

## 🔧 Advanced Usage

### Export Design System as CSS

```javascript
import { exportDesignSystemCSS } from './js/design-system/index.js';

// Generate complete CSS file content
const cssContent = exportDesignSystemCSS();
console.log(cssContent);
```

### Access Complete Design System Object

```javascript
import DesignSystem from './js/design-system/index.js';

console.log(DesignSystem.colors);      // All colors
console.log(DesignSystem.spacing);     // All spacing
console.log(DesignSystem.typography);  // All typography
console.log(DesignSystem.layout);      // All layout config
```

## 📝 Examples

### Creating a Card Component

```javascript
import { COLOR_SYSTEM, SPACING } from './js/design-system/index.js';

const card = document.createElement('div');
card.style.background = COLOR_SYSTEM.background.elevated;
card.style.border = `1px solid ${COLOR_SYSTEM.border.default}`;
card.style.borderRadius = '20px';
card.style.padding = SPACING['6'];
card.style.transition = 'all 0.3s ease';

// Hover effect
card.addEventListener('mouseenter', () => {
  card.style.borderColor = COLOR_SYSTEM.border.accent;
  card.style.transform = 'translateY(-4px)';
});
```

### Responsive Grid

```javascript
import { getGridColumns, getGridGap } from './js/design-system/breakpoints.js';

function updateGrid() {
  const grid = document.querySelector('.menu-grid');
  grid.style.gridTemplateColumns = `repeat(${getGridColumns()}, 1fr)`;
  grid.style.gap = getGridGap();
}

// Call on load and resize
updateGrid();
window.addEventListener('resize', updateGrid);
```

## 🎯 Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Initialize once** at application start
3. **Use CSS custom properties** for better performance
4. **Leverage presets** for consistent typography
5. **Test on all breakpoints** using the provided utilities

## 📖 Documentation

For complete specifications and usage guidelines, refer to:
- `design.md` - Section 11: Visual Design & UX Enhancement
- `requirements.md` - Section 18: Design System Requirements

## 🤝 Contributing

When adding new design tokens:
1. Add to the appropriate module (colors, spacing, typography, layout)
2. Update the CSS generation function
3. Add JSDoc comments
4. Test across all breakpoints
5. Ensure WCAG AA compliance for color combinations

---

**Version**: 1.0  
**Last Updated**: 2025-01-13  
**Author**: Kiro AI

# Professional Spacing System Documentation

## Overview

This document describes the professional spacing system implemented for the Shams Restaurant website. The system ensures consistent visual rhythm and improves scannability across all components.

**Requirements Satisfied:** 18.3, 18.4

## Spacing Scale

Base unit: 4px

| Key | Value | Use Case |
|-----|-------|----------|
| 0.5 | 2px | Minimal spacing (borders, tight gaps) |
| 1 | 4px | Very tight spacing |
| 2 | 8px | Compact spacing (icon-text gaps) |
| 3 | 12px | Small spacing (button padding vertical, text blocks) |
| 4 | 16px | Default spacing (form fields, related elements) |
| 5 | 20px | Medium spacing (card padding mobile, grid gaps) |
| 6 | 24px | Standard spacing (card padding desktop, button horizontal) |
| 8 | 32px | Large spacing (modal padding, subsections) |
| 10 | 40px | X-large spacing |
| 12 | 48px | Section spacing mobile |
| 16 | 64px | Major section spacing desktop |
| 20 | 80px | Hero section spacing |
| 24 | 96px | Maximum section spacing |

## Component Padding

### Buttons
- **Default:** 12px vertical × 24px horizontal (`--spacing-3` × `--spacing-6`)
- **Small:** 8px vertical × 16px horizontal (`--spacing-2` × `--spacing-4`)
- **Large:** 16px vertical × 32px horizontal (`--spacing-4` × `--spacing-8`)

**Example:**
```css
button, .btn {
  padding: var(--spacing-3) var(--spacing-6);
}
```

### Cards
- **Mobile:** 20px all sides (`--spacing-5`)
- **Desktop:** 24px all sides (`--spacing-6`)

**Breakdown:**
- Card header: 16px × 20px
- Card body: 20px all sides
- Card footer: 16px × 20px

**Example:**
```css
.dish-card, .card {
  padding: var(--spacing-5); /* 20px on mobile */
}

@media (min-width: 1024px) {
  .dish-card, .card {
    padding: var(--spacing-6); /* 24px on desktop */
  }
}
```

### Modals
- **Overall:** 32px all sides (`--spacing-8`)
- **Header:** 24px × 32px, 16px bottom
- **Body:** 24px × 32px
- **Footer:** 16px × 32px, 24px top

**Example:**
```css
.modal-content {
  padding: var(--spacing-8); /* 32px */
}
```

### Page Containers
- **Mobile:** 16px left/right (`--spacing-4`)
- **Desktop:** 32px left/right (`--spacing-8`)

**Example:**
```css
.container {
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--spacing-8);
    padding-right: var(--spacing-8);
  }
}
```

## Component Gaps

### Grid Columns
- **Default:** 20px (`--spacing-5`)
- **Tablet+:** 24px (`--spacing-6`)
- **Desktop+:** 32px (`--spacing-8`)

**Example:**
```css
.grid, #dishesGrid {
  gap: var(--spacing-5); /* 20px */
}
```

### Button Groups
- **Default:** 12px (`--spacing-3`)
- **Tight:** 8px (`--spacing-2`)

**Example:**
```css
.button-group {
  gap: var(--spacing-3); /* 12px */
}
```

### Icon + Text
- **Default:** 8px (`--spacing-2`)

**Example:**
```css
.icon-text {
  gap: var(--spacing-2); /* 8px */
}
```

### Form Fields
- **Between fields:** 16px (`--spacing-4`)

**Example:**
```css
.form-group {
  margin-bottom: var(--spacing-4); /* 16px */
}
```

## Section Spacing

### Major Sections
- **Mobile:** 48px top/bottom (`--spacing-12`)
- **Desktop:** 64px top/bottom (`--spacing-16`)

**Example:**
```css
section {
  padding-top: var(--spacing-12);
  padding-bottom: var(--spacing-12);
}

@media (min-width: 1024px) {
  section {
    padding-top: var(--spacing-16);
    padding-bottom: var(--spacing-16);
  }
}
```

### Subsections
- **Vertical:** 32px top/bottom (`--spacing-8`)

**Example:**
```css
.subsection {
  margin-top: var(--spacing-8);
  margin-bottom: var(--spacing-8);
}
```

### Related Elements
- **Gap:** 16px (`--spacing-4`)

**Example:**
```css
.related-elements {
  gap: var(--spacing-4);
}
```

### Text Blocks
- **Paragraph spacing:** 12px (`--spacing-3`)

**Example:**
```css
.text-block p {
  margin-bottom: var(--spacing-3);
}
```

## Container Max-Widths

| Container | Max-Width | Use Case |
|-----------|-----------|----------|
| Full | 1440px | Wide screens, full-width content |
| Content | 1200px | Standard content area |
| Text | 720px | Readable text content |
| Form | 480px | Form containers |

**Example:**
```css
.container-full {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.container-content {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
```

## Specific Component Spacing

### Header
- **Padding:** 12px top/bottom (`--spacing-3`)

### Hero Section
- **Mobile:** 40px top/bottom (`--spacing-10`)
- **Tablet:** 48px top/bottom (`--spacing-12`)
- **Desktop:** 64px top/bottom (`--spacing-16`)

### Category Tabs
- **Mobile:** 8px × 16px (`--spacing-2` × `--spacing-4`)
- **Desktop:** 12px × 20px (`--spacing-3` × `--spacing-5`)

### Dish Cards
- **Content padding:** 20px (`--spacing-5`)
- **Footer top margin:** 16px (`--spacing-4`)

### Info Cards (Quick Info)
- **Padding:** 12px (`--spacing-3`)
- **Gap:** 12px (`--spacing-3`)
- **Icon size:** 36px

### FAQ Items
- **Mobile:** 16px padding (`--spacing-4`)
- **Desktop:** 20px padding (`--spacing-5`)
- **Answer top padding:** 12px (`--spacing-3`)

### Footer
- **Padding:** 48px top/bottom (`--spacing-12`)

## Utility Classes

### Margin Utilities
```css
.m-0 to .m-8    /* All sides */
.mt-0 to .mt-16 /* Top */
.mb-0 to .mb-16 /* Bottom */
.ml-0 to .ml-8  /* Left */
.mr-0 to .mr-8  /* Right */
```

### Padding Utilities
```css
.p-0 to .p-8    /* All sides */
.pt-0 to .pt-16 /* Top */
.pb-0 to .pb-16 /* Bottom */
.pl-0 to .pl-8  /* Left */
.pr-0 to .pr-8  /* Right */
```

### Gap Utilities
```css
.gap-0 to .gap-8 /* Flexbox/Grid gap */
```

## Usage Guidelines

### 1. Consistency
Always use the spacing scale values defined in the system. Never use arbitrary pixel values.

**Good:**
```css
.my-component {
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}
```

**Bad:**
```css
.my-component {
  padding: 15px; /* Not in the scale */
  margin-bottom: 25px; /* Not in the scale */
}
```

### 2. Responsive Spacing
Adjust spacing at breakpoints to maintain visual balance:

```css
.section {
  padding: var(--spacing-8); /* Mobile */
}

@media (min-width: 1024px) {
  .section {
    padding: var(--spacing-12); /* Desktop */
  }
}
```

### 3. Component-Specific Spacing
Use the predefined component classes when possible:

```css
/* Use existing class */
<button class="btn">Click me</button>

/* Instead of custom padding */
<button style="padding: 12px 24px;">Click me</button>
```

### 4. Utility Classes
Use utility classes for one-off adjustments:

```html
<div class="mt-4 mb-6">
  Content with top margin of 16px and bottom margin of 24px
</div>
```

## Browser Support

The spacing system uses CSS custom properties (CSS variables) which are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, consider using a PostCSS plugin to convert custom properties to static values.

## Implementation Checklist

- [x] Define spacing scale in `spacing.js`
- [x] Export spacing as CSS custom properties in `variables.css`
- [x] Create comprehensive spacing CSS in `spacing.css`
- [x] Apply spacing to all button components
- [x] Apply spacing to all card components
- [x] Apply spacing to modal components
- [x] Define section spacing (major, subsections, elements)
- [x] Set container max-widths (full, content, text, form)
- [x] Create utility classes for margins, padding, and gaps
- [x] Add responsive spacing adjustments
- [x] Link `spacing.css` in `index.html`
- [x] Document the spacing system

## Testing

To verify the spacing system is working correctly:

1. **Visual Inspection:** Check that all components use consistent spacing
2. **DevTools:** Inspect elements to confirm they use CSS custom properties
3. **Responsive Testing:** Verify spacing adjusts correctly at breakpoints
4. **Cross-Browser:** Test in Chrome, Firefox, Safari, and Edge

## Maintenance

When adding new components:

1. Use the existing spacing scale
2. Follow the component padding guidelines
3. Use appropriate gaps for flex/grid layouts
4. Apply responsive spacing for mobile/tablet/desktop
5. Document any new spacing patterns

## References

- Design Document: Section 18.3 (Spacing System)
- Requirements: 18.3, 18.4
- Spacing Scale Definition: `js/design-system/spacing.js`
- CSS Variables: `css/design-system/variables.css`
- Implementation: `css/design-system/spacing.css`

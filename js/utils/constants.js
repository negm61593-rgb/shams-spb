/**
 * constants.js - Configuration values and constants for Shams Restaurant website
 * 
 * This module centralizes all configuration values, including:
 * - Breakpoints for responsive design
 * - Cache headers for performance optimization
 * - Language configuration
 * - Performance budgets
 * - API endpoints and paths
 * - Feature flags
 * 
 * @module constants
 * @version 1.0.0
 */

/**
 * Responsive breakpoint definitions
 * Used for media queries and responsive behavior
 * @constant {Object}
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  wide: '(min-width: 1440px)',
  highDPI: '(min-resolution: 2dppx)'
};

/**
 * Numeric breakpoint values in pixels
 * Useful for JavaScript-based responsive logic
 * @constant {Object}
 */
export const BREAKPOINT_VALUES = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
  wide: 1440
};

/**
 * Cache-Control header values for different resource types
 * Optimizes browser caching strategy
 * @constant {Object}
 */
export const CACHE_HEADERS = {
  html: 'max-age=3600, must-revalidate',
  css: 'max-age=31536000, immutable',
  js: 'max-age=31536000, immutable',
  images: 'max-age=2592000',
  fonts: 'max-age=31536000, immutable',
  json: 'max-age=86400, must-revalidate'
};

/**
 * Language configuration with directionality
 * Supports Russian, Arabic, and English
 * @constant {Object}
 */
export const LANGUAGE_CONFIG = {
  ru: { 
    code: 'ru', 
    name: 'Русский', 
    direction: 'ltr',
    locale: 'ru-RU'
  },
  ar: { 
    code: 'ar', 
    name: 'العربية', 
    direction: 'rtl',
    locale: 'ar-EG'
  },
  en: { 
    code: 'en', 
    name: 'English', 
    direction: 'ltr',
    locale: 'en-US'
  }
};

/**
 * Default language code
 * @constant {string}
 */
export const DEFAULT_LANGUAGE = 'ru';

/**
 * LocalStorage keys for persisting user preferences
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  language: 'shams_preferred_language',
  theme: 'shams_theme',
  categoryFilter: 'shams_category_filter'
};

/**
 * Performance budget thresholds
 * Used for monitoring and alerting on performance regressions
 * @constant {Object}
 */
export const PERFORMANCE_BUDGET = {
  pageLoadTime: {
    target: 2000,  // 2 seconds
    maximum: 3000  // 3 seconds
  },
  timeToInteractive: {
    target: 2500,
    maximum: 3500
  },
  firstContentfulPaint: {
    target: 1000,
    maximum: 1500
  },
  largestContentfulPaint: {
    target: 2000,
    maximum: 2500
  },
  totalPageWeight: {
    target: 1048576,   // 1 MB
    maximum: 1572864   // 1.5 MB
  },
  javascriptSize: {
    target: 204800,    // 200 KB
    maximum: 307200    // 300 KB
  },
  cssSize: {
    target: 51200,     // 50 KB
    maximum: 76800     // 75 KB
  },
  imageTotal: {
    target: 614400,    // 600 KB
    maximum: 1048576   // 1 MB
  }
};

/**
 * Core Web Vitals thresholds (good/needs improvement/poor)
 * @constant {Object}
 */
export const WEB_VITALS = {
  LCP: {  // Largest Contentful Paint (ms)
    good: 2500,
    needsImprovement: 4000
  },
  FID: {  // First Input Delay (ms)
    good: 100,
    needsImprovement: 300
  },
  CLS: {  // Cumulative Layout Shift (score)
    good: 0.1,
    needsImprovement: 0.25
  }
};

/**
 * Image optimization configuration
 * @constant {Object}
 */
export const IMAGE_CONFIG = {
  formats: ['webp', 'jpeg'],
  quality: {
    webp: 85,
    jpeg: 85
  },
  sizes: {
    mobile: 400,
    tablet: 600,
    desktop: 800,
    thumbnail: 200
  },
  fallbackImage: '/images/placeholder.jpg',
  lazyLoadThreshold: 200  // pixels before viewport
};

/**
 * Dish category definitions
 * @constant {Object}
 */
export const CATEGORIES = {
  all: { 
    id: 'all', 
    name: { ru: 'Все блюда', ar: 'جميع الأطباق', en: 'All dishes' },
    count: 65 
  },
  shawarma: { 
    id: 'shawarma', 
    name: { ru: 'Шаверма', ar: 'شاورما', en: 'Shawarma' },
    count: 31 
  },
  falafel: { 
    id: 'falafel', 
    name: { ru: 'Фалафель', ar: 'فلافل', en: 'Falafel' },
    count: 3 
  },
  burgers: { 
    id: 'burgers', 
    name: { ru: 'Бургеры', ar: 'برجر', en: 'Burgers' },
    count: 5 
  },
  hotdog: { 
    id: 'hotdog', 
    name: { ru: 'Хот-доги', ar: 'هوت دوج', en: 'Hot dogs' },
    count: 4 
  },
  boxes: { 
    id: 'boxes', 
    name: { ru: 'Боксы и закуски', ar: 'وجبات ومقبلات', en: 'Boxes & snacks' },
    count: 11 
  },
  drinks_sauces: { 
    id: 'drinks_sauces', 
    name: { ru: 'Напитки и соусы', ar: 'مشروبات وصلصات', en: 'Drinks & sauces' },
    count: 11 
  }
};

/**
 * Restaurant contact information
 * @constant {Object}
 */
export const CONTACT_INFO = {
  name: 'Шамс (Shams)',
  phones: [
    { number: '+79990371312', display: '+7 999 037-13-12' }
  ],
  address: {
    street: 'Комендантский проспект, 61К',
    building: 'ЖК Yoga',
    city: 'Санкт-Петербург',
    postalCode: '197373',
    country: 'RU'
  },
  coordinates: {
    latitude: 60.034654,
    longitude: 30.229038
  },
  hours: {
    display: 'Ежедневно 10:00 - 01:00',
    opens: '10:00',
    closes: '01:00',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  socialMedia: {
    whatsapp: 'https://wa.me/79990371312',
    telegram: 'https://t.me/shams_spb',
    yandexMaps: 'https://yandex.com/maps/org/161945997447/'
  },
  rating: {
    value: 5.0,
    reviewCount: 470
  }
};

/**
 * Animation duration constants (milliseconds)
 * @constant {Object}
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  categorySwitch: 200,
  languageSwitch: 500,
  fadeIn: 600,
  cardHover: 300
};

/**
 * Accessibility configuration
 * @constant {Object}
 */
export const A11Y_CONFIG = {
  minTouchTarget: 44,  // pixels
  contrastRatio: {
    normalText: 4.5,
    largeText: 3.0
  },
  focusOutlineWidth: 2,  // pixels
  focusOutlineOffset: 4  // pixels
};

/**
 * Description validation rules
 * @constant {Object}
 */
export const DESCRIPTION_RULES = {
  minLength: 200,
  maxLength: 400,
  requiredElements: ['ingredients', 'preparation', 'flavor']
};

/**
 * QR Code configuration
 * @constant {Object}
 */
export const QR_CONFIG = {
  size: 256,
  errorCorrectionLevel: 'M',
  backgroundColor: '#FFFFFF',
  foregroundColor: '#000000',
  generationTimeout: 500  // milliseconds
};

/**
 * Feature flags for gradual rollout and A/B testing
 * @constant {Object}
 */
export const FEATURE_FLAGS = {
  enableQRCode: true,
  enablePerformanceMonitoring: true,
  enableLazyLoading: true,
  enableWebP: true,
  enableAnimations: true,
  enableServiceWorker: false  // Future feature
};

/**
 * API and data endpoints
 * @constant {Object}
 */
export const ENDPOINTS = {
  menuData: './dishes_catalog.json',
  translations: './translations.json',
  fallbackMenuData: './dishes.js'
};

/**
 * Error message timeouts (milliseconds)
 * @constant {Object}
 */
export const ERROR_CONFIG = {
  toastDuration: 5000,
  retryDelay: 1000,
  maxRetries: 3
};

/**
 * SEO configuration
 * @constant {Object}
 */
export const SEO_CONFIG = {
  siteName: 'Шамс - Египетская шаверма в СПб',
  siteDescription: 'Аутентичная египетская шаверма, фалафель и другие блюда в Санкт-Петербурге. Ежедневно с 10:00 до 01:00.',
  keywords: [
    'шаверма египетская',
    'шаверма спб',
    'фалафель петербург',
    'египетская кухня',
    'доставка шавермы',
    'комендантский проспект'
  ],
  ogImage: './hero_dish.jpg',
  twitterCard: 'summary_large_image'
};

/**
 * Timezone for the restaurant
 * @constant {string}
 */
export const TIMEZONE = 'Europe/Moscow';

/**
 * Currency configuration
 * @constant {Object}
 */
export const CURRENCY = {
  code: 'RUB',
  symbol: '₽',
  position: 'after'  // 'before' or 'after' the amount
};

// Export all constants as a single object for convenience
export default {
  BREAKPOINTS,
  BREAKPOINT_VALUES,
  CACHE_HEADERS,
  LANGUAGE_CONFIG,
  DEFAULT_LANGUAGE,
  STORAGE_KEYS,
  PERFORMANCE_BUDGET,
  WEB_VITALS,
  IMAGE_CONFIG,
  CATEGORIES,
  CONTACT_INFO,
  ANIMATION_DURATION,
  A11Y_CONFIG,
  DESCRIPTION_RULES,
  QR_CONFIG,
  FEATURE_FLAGS,
  ENDPOINTS,
  ERROR_CONFIG,
  SEO_CONFIG,
  TIMEZONE,
  CURRENCY
};

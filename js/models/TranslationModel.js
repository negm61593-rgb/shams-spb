/**
 * @fileoverview Translation model for Shams Restaurant multi-language support
 * @description Manages translations across Russian, Arabic, and English languages
 */

/**
 * @typedef {('ru'|'ar'|'en')} LanguageCode
 * Language code for supported languages
 */

/**
 * @typedef {Object} LanguageConfig
 * @property {string} code - Language code (ru, ar, en)
 * @property {string} name - Display name in native language
 * @property {('ltr'|'rtl')} direction - Text direction
 */

/**
 * TranslationModel class for managing multi-language support
 * Handles translations for Russian, Arabic, and English
 */
class TranslationModel {
  /**
   * Create a new TranslationModel instance
   * Initializes empty translation dictionaries for all supported languages
   */
  constructor() {
    /**
     * @type {Object.<string, Object.<string, string>>}
     * @private
     */
    this.translations = {
      ru: {},
      ar: {},
      en: {}
    };

    /**
     * Language configuration for all supported languages
     * @type {Object.<string, LanguageConfig>}
     * @readonly
     */
    this.LANGUAGE_CONFIG = {
      ru: { code: 'ru', name: 'Русский', direction: 'ltr' },
      ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
      en: { code: 'en', name: 'English', direction: 'ltr' }
    };
  }

  /**
   * Add translation entry for a key across all languages
   * @param {string} key - Translation key identifier
   * @param {Object.<LanguageCode, string>} values - Language code to text mapping
   * @example
   * translationModel.add('menu.title', {
   *   ru: 'Меню',
   *   ar: 'قائمة الطعام',
   *   en: 'Menu'
   * });
   */
  add(key, values) {
    Object.keys(values).forEach(lang => {
      if (this.translations[lang]) {
        this.translations[lang][key] = values[lang];
      }
    });
  }

  /**
   * Add multiple translation entries at once
   * @param {Object.<string, Object.<LanguageCode, string>>} entries - Object with multiple key-value pairs
   * @example
   * translationModel.addMultiple({
   *   'menu.title': { ru: 'Меню', ar: 'قائمة الطعام', en: 'Menu' },
   *   'menu.category.all': { ru: 'Все блюда', ar: 'جميع الأطباق', en: 'All Dishes' }
   * });
   */
  addMultiple(entries) {
    Object.keys(entries).forEach(key => {
      this.add(key, entries[key]);
    });
  }

  /**
   * Get translation for a specific key and language
   * @param {string} key - Translation key
   * @param {LanguageCode} lang - Language code
   * @returns {string} Translated text, returns key if translation not found
   */
  get(key, lang) {
    return this.translations[lang]?.[key] || key;
  }

  /**
   * Get translation with fallback chain (requested lang -> Russian -> key)
   * @param {string} key - Translation key
   * @param {LanguageCode} lang - Preferred language code
   * @returns {string} Translated text with fallback support
   */
  getWithFallback(key, lang) {
    // Try requested language
    if (this.translations[lang]?.[key]) {
      return this.translations[lang][key];
    }
    
    // Fall back to Russian
    if (this.translations.ru[key]) {
      return this.translations.ru[key];
    }
    
    // Return key if no translation found
    return key;
  }

  /**
   * Get all translations for a specific key
   * @param {string} key - Translation key
   * @returns {Object.<LanguageCode, string>} Object with all language translations
   */
  getAll(key) {
    return {
      ru: this.get(key, 'ru'),
      ar: this.get(key, 'ar'),
      en: this.get(key, 'en')
    };
  }

  /**
   * Check if translation exists for all languages
   * @param {string} key - Translation key
   * @returns {boolean} True if all languages have translation for this key
   */
  isComplete(key) {
    return ['ru', 'ar', 'en'].every(lang =>
      this.translations[lang][key] !== undefined
    );
  }

  /**
   * Check if translation exists for a specific language
   * @param {string} key - Translation key
   * @param {LanguageCode} lang - Language code
   * @returns {boolean} True if translation exists
   */
  has(key, lang) {
    return this.translations[lang]?.[key] !== undefined;
  }

  /**
   * Get all keys that are missing translations in one or more languages
   * @returns {string[]} Array of keys with incomplete translations
   */
  getMissingKeys() {
    const allKeys = new Set();
    
    // Collect all keys from all languages
    Object.values(this.translations).forEach(langTrans => {
      Object.keys(langTrans).forEach(key => allKeys.add(key));
    });

    // Filter to keys that are not complete
    return Array.from(allKeys).filter(key => !this.isComplete(key));
  }

  /**
   * Get missing translations for a specific language
   * @param {LanguageCode} lang - Language code
   * @returns {string[]} Array of keys missing in the specified language
   */
  getMissingForLanguage(lang) {
    const allKeys = new Set();
    
    // Collect all keys from all languages
    Object.values(this.translations).forEach(langTrans => {
      Object.keys(langTrans).forEach(key => allKeys.add(key));
    });

    // Filter to keys missing in specified language
    return Array.from(allKeys).filter(key => !this.has(key, lang));
  }

  /**
   * Get language configuration
   * @param {LanguageCode} lang - Language code
   * @returns {LanguageConfig|null} Language configuration or null if not found
   */
  getLanguageConfig(lang) {
    return this.LANGUAGE_CONFIG[lang] || null;
  }

  /**
   * Get text direction for language
   * @param {LanguageCode} lang - Language code
   * @returns {('ltr'|'rtl')} Text direction (left-to-right or right-to-left)
   */
  getDirection(lang) {
    return this.LANGUAGE_CONFIG[lang]?.direction || 'ltr';
  }

  /**
   * Get display name for language
   * @param {LanguageCode} lang - Language code
   * @returns {string} Language display name in its native script
   */
  getLanguageName(lang) {
    return this.LANGUAGE_CONFIG[lang]?.name || lang;
  }

  /**
   * Get all supported language codes
   * @returns {LanguageCode[]} Array of supported language codes
   */
  getSupportedLanguages() {
    return ['ru', 'ar', 'en'];
  }

  /**
   * Check if language is supported
   * @param {string} lang - Language code to check
   * @returns {boolean} True if language is supported
   */
  isLanguageSupported(lang) {
    return this.getSupportedLanguages().includes(lang);
  }

  /**
   * Get count of translations for a specific language
   * @param {LanguageCode} lang - Language code
   * @returns {number} Number of translation keys for the language
   */
  getTranslationCount(lang) {
    return Object.keys(this.translations[lang] || {}).length;
  }

  /**
   * Get statistics about translation completeness
   * @returns {Object} Statistics object with counts per language
   */
  getStatistics() {
    const allKeys = new Set();
    
    Object.values(this.translations).forEach(langTrans => {
      Object.keys(langTrans).forEach(key => allKeys.add(key));
    });

    const totalKeys = allKeys.size;

    return {
      totalKeys: totalKeys,
      languages: {
        ru: {
          count: this.getTranslationCount('ru'),
          percentage: totalKeys > 0 ? Math.round((this.getTranslationCount('ru') / totalKeys) * 100) : 0
        },
        ar: {
          count: this.getTranslationCount('ar'),
          percentage: totalKeys > 0 ? Math.round((this.getTranslationCount('ar') / totalKeys) * 100) : 0
        },
        en: {
          count: this.getTranslationCount('en'),
          percentage: totalKeys > 0 ? Math.round((this.getTranslationCount('en') / totalKeys) * 100) : 0
        }
      },
      missingKeys: this.getMissingKeys().length
    };
  }

  /**
   * Clear all translations
   */
  clear() {
    this.translations = {
      ru: {},
      ar: {},
      en: {}
    };
  }

  /**
   * Clear translations for a specific language
   * @param {LanguageCode} lang - Language code
   */
  clearLanguage(lang) {
    if (this.translations[lang]) {
      this.translations[lang] = {};
    }
  }

  /**
   * Remove a specific translation key from all languages
   * @param {string} key - Translation key to remove
   */
  remove(key) {
    ['ru', 'ar', 'en'].forEach(lang => {
      if (this.translations[lang][key]) {
        delete this.translations[lang][key];
      }
    });
  }

  /**
   * Export all translations as plain object
   * @returns {Object.<string, Object.<LanguageCode, string>>} Plain object with all translations
   */
  toObject() {
    return JSON.parse(JSON.stringify(this.translations));
  }

  /**
   * Import translations from plain object
   * @param {Object.<string, Object.<LanguageCode, string>>} data - Translations data
   */
  fromObject(data) {
    if (data && typeof data === 'object') {
      this.translations = {
        ru: data.ru || {},
        ar: data.ar || {},
        en: data.en || {}
      };
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationModel;
}

// Export for browser global scope
if (typeof window !== 'undefined') {
  window.TranslationModel = TranslationModel;
}

/**
 * @fileoverview Dish data model for Shams Restaurant menu system
 * @description Represents a single dish with multilingual support and validation
 */

/**
 * @typedef {Object} TranslatableText
 * @property {string} ru - Russian text
 * @property {string} ar - Arabic text
 * @property {string} en - English text
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of validation error messages
 */

/**
 * DishModel class representing a single menu dish
 * Handles dish data with multilingual support for title and description
 */
class DishModel {
  /**
   * Create a new DishModel instance
   * @param {Object} data - Raw dish data object
   * @param {number} data.id - Unique dish identifier
   * @param {TranslatableText} data.title - Dish name in multiple languages
   * @param {TranslatableText} data.desc - Dish description in multiple languages
   * @param {number} data.price - Price in rubles
   * @param {string} data.volume - Serving size (e.g., "380 г")
   * @param {string} data.category - Category identifier
   * @param {boolean} [data.popular=false] - Whether featured as popular
   * @param {string} data.photo - Local photo path
   * @param {string} [data.cdnPhoto] - Optional CDN photo URL
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.desc = data.desc;
    this.price = data.price;
    this.volume = data.volume;
    this.category = data.category;
    this.popular = data.popular || false;
    this.photo = data.photo;
    this.cdnPhoto = data.cdnPhoto || null;
  }

  /**
   * Get title in specified language
   * @param {('ru'|'ar'|'en')} lang - Language code
   * @returns {string} Translated title, falls back to Russian if not available
   */
  getTitle(lang) {
    return this.title[lang] || this.title.ru;
  }

  /**
   * Get description in specified language
   * @param {('ru'|'ar'|'en')} lang - Language code
   * @returns {string} Translated description, falls back to Russian if not available
   */
  getDescription(lang) {
    return this.desc[lang] || this.desc.ru;
  }

  /**
   * Validate dish data completeness
   * Checks all required fields and description constraints
   * @returns {ValidationResult} Validation result with errors if any
   */
  validate() {
    const errors = [];

    // Validate required fields
    if (!this.id) {
      errors.push('Missing id');
    }

    if (!this.title || typeof this.title !== 'object') {
      errors.push('Missing or invalid title object');
    } else if (!this.title.ru) {
      errors.push('Missing title.ru');
    }

    if (!this.desc || typeof this.desc !== 'object') {
      errors.push('Missing or invalid desc object');
    }

    if (!this.price || typeof this.price !== 'number') {
      errors.push('Missing or invalid price');
    }

    if (!this.category) {
      errors.push('Missing category');
    }

    if (!this.photo) {
      errors.push('Missing photo');
    }

    // Check description completeness for all languages
    if (this.desc && typeof this.desc === 'object') {
      ['ru', 'ar', 'en'].forEach(lang => {
        const desc = this.desc[lang];
        if (!desc) {
          errors.push(`Missing description for ${lang}`);
        } else if (desc.length < 200 || desc.length > 400) {
          errors.push(`Invalid description length for ${lang} (must be 200-400 characters, got ${desc.length})`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate that a specific field exists
   * @param {string} field - Field name to validate
   * @returns {boolean} True if field exists and is not null/undefined
   */
  hasField(field) {
    return this[field] !== null && this[field] !== undefined;
  }

  /**
   * Validate title field structure
   * @returns {boolean} True if title has all required languages
   */
  hasValidTitle() {
    return this.title &&
           typeof this.title === 'object' &&
           this.title.ru &&
           this.title.ar &&
           this.title.en;
  }

  /**
   * Validate description field structure
   * @returns {boolean} True if description has all required languages
   */
  hasValidDescription() {
    return this.desc &&
           typeof this.desc === 'object' &&
           this.desc.ru &&
           this.desc.ar &&
           this.desc.en;
  }

  /**
   * Validate price field
   * @returns {boolean} True if price is a positive number
   */
  hasValidPrice() {
    return typeof this.price === 'number' && this.price > 0;
  }

  /**
   * Validate category field
   * @returns {boolean} True if category is a non-empty string
   */
  hasValidCategory() {
    return typeof this.category === 'string' && this.category.length > 0;
  }

  /**
   * Validate photo field
   * @returns {boolean} True if photo is a non-empty string
   */
  hasValidPhoto() {
    return typeof this.photo === 'string' && this.photo.length > 0;
  }

  /**
   * Get optimized image path based on viewport width and pixel density
   * @param {number} width - Desired width in pixels
   * @param {boolean} [isRetina=false] - Whether display is high DPI (retina)
   * @returns {string} Optimized image path (CDN if available, otherwise local)
   */
  getImagePath(width, isRetina = false) {
    const multiplier = isRetina ? 2 : 1;
    const targetWidth = width * multiplier;

    // Return CDN photo if available, otherwise local
    // CDN URLs are already optimized, local paths may need size variants
    return this.cdnPhoto || this.photo;
  }

  /**
   * Get formatted price string with currency symbol
   * @returns {string} Formatted price (e.g., "460 ₽")
   */
  getFormattedPrice() {
    return `${this.price} ₽`;
  }

  /**
   * Check if this dish is marked as popular
   * @returns {boolean} True if dish is popular
   */
  isPopular() {
    return this.popular === true;
  }

  /**
   * Get dish data as plain object
   * @returns {Object} Plain object representation of dish
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      desc: this.desc,
      price: this.price,
      volume: this.volume,
      category: this.category,
      popular: this.popular,
      photo: this.photo,
      cdnPhoto: this.cdnPhoto
    };
  }

  /**
   * Create DishModel from plain object
   * @param {Object} data - Plain object with dish data
   * @returns {DishModel} New DishModel instance
   */
  static fromObject(data) {
    return new DishModel(data);
  }

  /**
   * Create multiple DishModel instances from array of objects
   * @param {Object[]} dataArray - Array of plain dish objects
   * @returns {DishModel[]} Array of DishModel instances
   */
  static fromArray(dataArray) {
    return dataArray.map(data => new DishModel(data));
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DishModel;
}

// Export for browser global scope
if (typeof window !== 'undefined') {
  window.DishModel = DishModel;
}

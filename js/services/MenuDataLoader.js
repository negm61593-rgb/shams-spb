/**
 * @fileoverview Menu Data Loader service for Shams Restaurant
 * @description Loads, parses, and validates the dish catalog JSON file
 */

/**
 * MenuDataLoader class
 * Responsible for loading menu data from JSON, validating dish entries,
 * and handling data load failures gracefully
 */
class MenuDataLoader {
  /**
   * Create a new MenuDataLoader instance
   * @param {Object} options - Configuration options
   * @param {string} [options.dataSource='dishes_catalog.json'] - Path to menu data file
   * @param {ErrorHandler} [options.errorHandler=null] - Error handler instance
   */
  constructor(options = {}) {
    this.dataSource = options.dataSource || 'dishes_catalog.json';
    this.errorHandler = options.errorHandler || null;
    this.dishes = [];
    this.isLoaded = false;
  }

  /**
   * Load and validate menu data from JSON file
   * @returns {Promise<DishModel[]>} Array of validated DishModel instances
   * @throws {Error} If data cannot be loaded or parsed
   */
  async loadMenuData() {
    try {
      // Fetch the JSON data
      const response = await fetch(this.dataSource);

      if (!response.ok) {
        throw new Error(`Failed to load menu data: ${response.status} ${response.statusText}`);
      }

      // Parse JSON
      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        throw new Error('Menu data must be an array');
      }

      // Transform and validate each dish
      this.dishes = [];
      const validationErrors = [];

      for (let i = 0; i < rawData.length; i++) {
        const rawDish = rawData[i];

        try {
          // Transform raw data to DishModel format
          const transformedDish = this.transformDishData(rawDish, i);

          // Create DishModel instance
          const dishModel = new DishModel(transformedDish);

          // Validate the dish
          const validationResult = this.validateDish(dishModel);

          if (validationResult.valid) {
            this.dishes.push(dishModel);
          } else {
            validationErrors.push({
              index: i,
              title: rawDish.title || 'Unknown',
              errors: validationResult.errors
            });

            // Add dish anyway if it has critical fields (id, title, price)
            if (dishModel.id && dishModel.title && dishModel.price) {
              console.warn(`Dish ${i} has validation errors but will be included:`, validationResult.errors);
              this.dishes.push(dishModel);
            }
          }
        } catch (error) {
          validationErrors.push({
            index: i,
            title: rawDish.title || 'Unknown',
            errors: [`Failed to process: ${error.message}`]
          });
        }
      }

      // Log validation summary
      if (validationErrors.length > 0) {
        console.warn(`Menu data loaded with ${validationErrors.length} validation issues:`, validationErrors);

        if (this.errorHandler) {
          this.errorHandler.handle(
            new Error(`${validationErrors.length} dishes have validation issues`),
            'VALIDATION',
            { validationErrors }
          );
        }
      }

      this.isLoaded = true;
      console.log(`Successfully loaded ${this.dishes.length} dishes`);

      return this.dishes;

    } catch (error) {
      console.error('Failed to load menu data:', error);

      if (this.errorHandler) {
        this.errorHandler.handle(error, 'DATA_LOAD', {
          dataSource: this.dataSource
        });
      }

      throw error;
    }
  }

  /**
   * Transform raw dish data from JSON to DishModel format
   * Handles the mismatch between JSON structure and DishModel expectations
   * @param {Object} rawDish - Raw dish data from JSON
   * @param {number} index - Index in the array (used as fallback ID)
   * @returns {Object} Transformed dish data
   * @private
   */
  transformDishData(rawDish, index) {
    // Generate ID if not present
    const id = rawDish.id || index + 1;

    // Transform title to multilingual format if needed
    const title = this.ensureTranslatableText(rawDish.title, rawDish.titleTranslations);

    // Transform description to multilingual format if needed
    const desc = this.ensureTranslatableText(rawDish.description, rawDish.descTranslations);

    // Parse price if it's a string
    let price = rawDish.price;
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^\d.-]/g, ''));
    }

    // Determine category (you may need to adjust this logic)
    const category = rawDish.category || this.inferCategory(rawDish.title);

    return {
      id,
      title,
      desc,
      price,
      volume: rawDish.volume || '',
      category,
      popular: rawDish.popular || false,
      photo: rawDish.localPhoto || rawDish.photo || '',
      cdnPhoto: rawDish.cdnPhoto || rawDish.photoLink || null
    };
  }

  /**
   * Ensure text is in translatable format (object with ru, ar, en)
   * @param {string|Object} text - Text or translatable object
   * @param {Object} [translations=null] - Optional explicit translations
   * @returns {Object} Translatable text object
   * @private
   */
  ensureTranslatableText(text, translations = null) {
    // If already an object with language codes, return as-is
    if (text && typeof text === 'object' && (text.ru || text.ar || text.en)) {
      return {
        ru: text.ru || '',
        ar: text.ar || '',
        en: text.en || ''
      };
    }

    // If explicit translations provided
    if (translations && typeof translations === 'object') {
      return {
        ru: translations.ru || text || '',
        ar: translations.ar || text || '',
        en: translations.en || text || ''
      };
    }

    // If string, assume it's Russian (default language) and create placeholder for others
    if (typeof text === 'string') {
      return {
        ru: text,
        ar: text, // Placeholder - should be translated
        en: text  // Placeholder - should be translated
      };
    }

    // Fallback
    return {
      ru: '',
      ar: '',
      en: ''
    };
  }

  /**
   * Infer category from dish title
   * @param {string|Object} title - Dish title
   * @returns {string} Inferred category
   * @private
   */
  inferCategory(title) {
    const titleStr = typeof title === 'string' ? title : (title?.ru || '');
    const lowerTitle = titleStr.toLowerCase();

    if (lowerTitle.includes('шаверм') || lowerTitle.includes('shawarma')) {
      return 'shawarma';
    } else if (lowerTitle.includes('фалафель') || lowerTitle.includes('falafel')) {
      return 'falafel';
    } else if (lowerTitle.includes('бургер') || lowerTitle.includes('burger')) {
      return 'burgers';
    } else if (lowerTitle.includes('хот-дог') || lowerTitle.includes('hotdog')) {
      return 'hotdog';
    } else if (lowerTitle.includes('бокс') || lowerTitle.includes('box')) {
      return 'boxes';
    } else if (lowerTitle.includes('напиток') || lowerTitle.includes('соус') || 
               lowerTitle.includes('drink') || lowerTitle.includes('sauce')) {
      return 'drinks_sauces';
    }

    return 'other';
  }

  /**
   * Validate a single dish entry using DishModel validation
   * @param {DishModel} dish - Dish model instance to validate
   * @returns {ValidationResult} Validation result with errors if any
   */
  validateDish(dish) {
    // Use DishModel's built-in validation
    if (typeof dish.validate === 'function') {
      return dish.validate();
    }

    // Fallback manual validation if DishModel.validate not available
    const errors = [];

    if (!dish.id) {
      errors.push('Missing id');
    }

    if (!dish.title || typeof dish.title !== 'object') {
      errors.push('Missing or invalid title');
    }

    if (!dish.desc || typeof dish.desc !== 'object') {
      errors.push('Missing or invalid description');
    }

    if (!dish.price || typeof dish.price !== 'number') {
      errors.push('Missing or invalid price');
    }

    if (!dish.category) {
      errors.push('Missing category');
    }

    if (!dish.photo) {
      errors.push('Missing photo');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if all required fields are present in a dish
   * @param {Object} dish - Dish object to check
   * @returns {boolean} True if all required fields are present
   */
  hasRequiredFields(dish) {
    const required = ['id', 'title', 'price', 'category', 'photo'];
    return required.every(field => {
      const value = dish[field];
      return value !== null && value !== undefined && value !== '';
    });
  }

  /**
   * Get all loaded dishes
   * @returns {DishModel[]} Array of dish models
   */
  getDishes() {
    return this.dishes;
  }

  /**
   * Get dishes filtered by category
   * @param {string} category - Category to filter by
   * @returns {DishModel[]} Filtered array of dishes
   */
  getDishesByCategory(category) {
    if (category === 'all') {
      return this.dishes;
    }
    return this.dishes.filter(dish => dish.category === category);
  }

  /**
   * Get a single dish by ID
   * @param {number} id - Dish ID
   * @returns {DishModel|null} Dish model or null if not found
   */
  getDishById(id) {
    return this.dishes.find(dish => dish.id === id) || null;
  }

  /**
   * Get count of dishes in each category
   * @returns {Object.<string, number>} Category counts
   */
  getCategoryCounts() {
    const counts = {
      all: this.dishes.length
    };

    this.dishes.forEach(dish => {
      const category = dish.category;
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  }

  /**
   * Check if menu data is loaded
   * @returns {boolean} True if data is loaded
   */
  isDataLoaded() {
    return this.isLoaded;
  }

  /**
   * Reload menu data (clears cache and loads fresh)
   * @returns {Promise<DishModel[]>} Array of validated dishes
   */
  async reload() {
    this.dishes = [];
    this.isLoaded = false;
    return this.loadMenuData();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuDataLoader;
}

// Export for browser global scope
if (typeof window !== 'undefined') {
  window.MenuDataLoader = MenuDataLoader;
}

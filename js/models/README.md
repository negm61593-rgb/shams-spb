# Shams Restaurant - Data Models

This directory contains the core data models for the Shams Restaurant website enhancement project.

## Overview

The models provide structured data representation and validation for dishes and translations across the application. They support multi-language functionality (Russian, Arabic, English) and enforce data consistency.

## Files

- **DishModel.js** - Dish data model with validation
- **TranslationModel.js** - Multi-language translation management
- **index.js** - Central export point for all models
- **test-models.html** - Browser-based test suite
- **README.md** - This documentation file

## DishModel

### Purpose
Represents a single menu dish with multilingual support for title and description. Provides validation methods to ensure all required fields meet the application requirements.

### Constructor
```javascript
new DishModel({
  id: 1,
  title: { ru: 'Название', ar: 'عنوان', en: 'Title' },
  desc: { ru: 'Описание...', ar: 'وصف...', en: 'Description...' },
  price: 460,
  volume: '380 г',
  category: 'shawarma',
  popular: true,
  photo: 'real_photos/dishes/dish_1.jpg',
  cdnPhoto: 'https://cdn.example.com/dish_1.jpg' // Optional
})
```

### Key Methods

#### `getTitle(lang)`
Returns the dish title in the specified language with fallback to Russian.
```javascript
dish.getTitle('en'); // Returns English title
```

#### `getDescription(lang)`
Returns the dish description in the specified language with fallback to Russian.
```javascript
dish.getDescription('ar'); // Returns Arabic description
```

#### `validate()`
Validates all required fields and returns a validation result object.
```javascript
const result = dish.validate();
// { valid: true/false, errors: ['error1', 'error2'] }
```

#### Validation Rules:
- **id**: Required, must be present
- **title**: Required object with ru, ar, en properties
- **desc**: Required object with ru, ar, en properties
- **price**: Required number, must be positive
- **category**: Required non-empty string
- **photo**: Required non-empty string
- **Description length**: Must be 200-400 characters for each language

#### Field Validation Methods
- `hasValidTitle()` - Checks if title has all required languages
- `hasValidDescription()` - Checks if description has all required languages
- `hasValidPrice()` - Checks if price is a positive number
- `hasValidCategory()` - Checks if category is a non-empty string
- `hasValidPhoto()` - Checks if photo path is provided

#### Utility Methods
- `getImagePath(width, isRetina)` - Returns optimized image path
- `getFormattedPrice()` - Returns formatted price string (e.g., "460 ₽")
- `isPopular()` - Returns whether dish is marked as popular
- `toObject()` - Converts model to plain object

#### Static Methods
- `DishModel.fromObject(data)` - Create single model from object
- `DishModel.fromArray(dataArray)` - Create multiple models from array

### Usage Example
```javascript
// Create model from existing data
const dishData = window.SHAMS_MENU[0];
const dish = new DishModel(dishData);

// Get localized content
const titleRu = dish.getTitle('ru');
const descEn = dish.getDescription('en');

// Validate
const validation = dish.validate();
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Create multiple dishes
const allDishes = DishModel.fromArray(window.SHAMS_MENU);
```

## TranslationModel

### Purpose
Manages translations across Russian, Arabic, and English languages. Provides methods for adding, retrieving, and validating translations throughout the application.

### Constructor
```javascript
const translations = new TranslationModel();
```

### Key Methods

#### `add(key, values)`
Add a single translation entry for all languages.
```javascript
translations.add('menu.title', {
  ru: 'Меню',
  ar: 'قائمة الطعام',
  en: 'Menu'
});
```

#### `addMultiple(entries)`
Add multiple translation entries at once.
```javascript
translations.addMultiple({
  'menu.title': { ru: 'Меню', ar: 'قائمة الطعام', en: 'Menu' },
  'menu.subtitle': { ru: 'Блюда', ar: 'الأطباق', en: 'Dishes' }
});
```

#### `get(key, lang)`
Get translation for specific key and language.
```javascript
const title = translations.get('menu.title', 'ru'); // Returns 'Меню'
```

#### `getWithFallback(key, lang)`
Get translation with fallback chain (requested → Russian → key).
```javascript
// If Arabic missing, falls back to Russian
const text = translations.getWithFallback('menu.title', 'ar');
```

#### `getAll(key)`
Get all language translations for a key.
```javascript
const allTitles = translations.getAll('menu.title');
// { ru: 'Меню', ar: 'قائمة الطعام', en: 'Menu' }
```

#### Validation Methods
- `isComplete(key)` - Check if key has all language translations
- `has(key, lang)` - Check if translation exists for specific language
- `getMissingKeys()` - Get keys missing in one or more languages
- `getMissingForLanguage(lang)` - Get keys missing for specific language

#### Language Configuration Methods
- `getLanguageConfig(lang)` - Get configuration for language
- `getDirection(lang)` - Get text direction ('ltr' or 'rtl')
- `getLanguageName(lang)` - Get native display name
- `getSupportedLanguages()` - Get array of supported language codes
- `isLanguageSupported(lang)` - Check if language is supported

#### Statistics Methods
- `getTranslationCount(lang)` - Get count of translations for language
- `getStatistics()` - Get detailed statistics about translation completeness

#### Management Methods
- `clear()` - Clear all translations
- `clearLanguage(lang)` - Clear translations for specific language
- `remove(key)` - Remove specific key from all languages
- `toObject()` - Export translations as plain object
- `fromObject(data)` - Import translations from plain object

### Language Configuration
The model includes built-in configuration for all supported languages:

```javascript
const config = {
  ru: { code: 'ru', name: 'Русский', direction: 'ltr' },
  ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
  en: { code: 'en', name: 'English', direction: 'ltr' }
};
```

### Usage Example
```javascript
// Create translation model
const translations = new TranslationModel();

// Add translations
translations.add('category.shawarma', {
  ru: 'Шаверма',
  ar: 'شاورما',
  en: 'Shawarma'
});

// Get specific translation
const categoryName = translations.get('category.shawarma', 'en');

// Check completeness
if (!translations.isComplete('category.shawarma')) {
  const missing = translations.getMissingForLanguage('ar');
  console.log('Missing Arabic translations:', missing);
}

// Get language info
const direction = translations.getDirection('ar'); // 'rtl'
const displayName = translations.getLanguageName('ru'); // 'Русский'

// Get statistics
const stats = translations.getStatistics();
console.log(`Translation completeness: ${stats.languages.ru.percentage}%`);
```

## Testing

Open `test-models.html` in a browser to run the test suite. The tests verify:

1. ✓ DishModel creation from existing data
2. ✓ Complete dish validation
3. ✓ Incomplete dish validation (should fail)
4. ✓ Field validation methods
5. ✓ Array creation from multiple dishes
6. ✓ TranslationModel add and get operations
7. ✓ Language configuration
8. ✓ Translation completeness checking
9. ✓ Translation statistics
10. ✓ Fallback functionality

All tests should pass with green checkmarks if the implementation is correct.

## Integration

### Browser Usage
```html
<!-- Include models in your HTML -->
<script src="js/models/DishModel.js"></script>
<script src="js/models/TranslationModel.js"></script>
<script src="dishes.js"></script>

<script>
  // Models are available on window object
  const dishes = DishModel.fromArray(window.SHAMS_MENU);
  const translations = new TranslationModel();
</script>
```

### Module Usage
```javascript
// ES6 modules or CommonJS
const { DishModel, TranslationModel } = require('./models');

// Or through namespace
const dish = new Models.DishModel(data);
```

## Requirements Mapping

This implementation satisfies the following requirements:

- **Requirement 1.1**: Multi-language dish data structure
- **Requirement 1.4**: Dish description validation
- **Requirement 17.1**: Data structure validation on load
- **Requirement 17.3**: Required field verification

## Design Mapping

This implementation follows design specifications:

- **Section 4.1**: DishModel with complete validation methods
- **Section 4.2**: TranslationModel for multi-language support
- **Section 3.1**: Data model architecture with JSDoc type definitions

## Future Enhancements

Potential improvements for future iterations:

1. Add TypeScript type definitions for better IDE support
2. Implement data caching and memoization for performance
3. Add JSON schema validation for runtime type checking
4. Implement model change detection and dirty tracking
5. Add model serialization/deserialization for API communication
6. Implement model relationships (e.g., DishModel → CategoryModel)

## License

Part of Shams Restaurant website enhancement project.

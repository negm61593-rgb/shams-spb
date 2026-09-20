/**
 * DescriptionValidator Service
 * 
 * Validates dish descriptions for completeness, length, and content quality.
 * Ensures descriptions meet requirements for creative storytelling style.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

/**
 * @typedef {Object} ContentAnalysis
 * @property {boolean} hasIngredients - Contains ingredient mentions
 * @property {boolean} hasPreparation - Contains preparation details
 * @property {boolean} hasFlavor - Contains flavor descriptors
 * @property {number} length - Character count
 * @property {boolean} isComplete - Overall completeness check
 * @property {string[]} issues - List of detected issues
 */

class DescriptionValidator {
  /**
   * Common ingredient keywords to detect in descriptions
   * @private
   */
  static INGREDIENT_KEYWORDS = [
    'курица', 'говядина', 'баранина', 'мясо', 'фалафель', 'нут', 'овощи', 'огурец', 
    'помидор', 'салат', 'капуста', 'морковь', 'свекла', 'картофель', 'сыр', 'соус',
    'майонез', 'кетчуп', 'чеснок', 'лук', 'перец', 'специи', 'зелень', 'петрушка',
    'кинза', 'укроп', 'рис', 'булгур', 'лаваш', 'хлеб', 'пита', 'котлета', 'колбаса',
    'chicken', 'beef', 'lamb', 'meat', 'falafel', 'chickpea', 'vegetables', 'cucumber',
    'tomato', 'lettuce', 'cabbage', 'carrot', 'cheese', 'sauce', 'garlic', 'onion',
    'دجاج', 'لحم', 'فلافل', 'حمص', 'خضروات', 'خيار', 'طماطم', 'خس', 'جبن', 'صوص', 'ثوم', 'بصل'
  ];

  /**
   * Common preparation method keywords
   * @private
   */
  static PREPARATION_KEYWORDS = [
    'жарен', 'запечен', 'приготовлен', 'обжарен', 'маринован', 'томлен', 'готов',
    'нарезан', 'измельчен', 'смешан', 'завернут', 'подается', 'сервируется',
    'grilled', 'fried', 'cooked', 'baked', 'prepared', 'marinated', 'roasted',
    'chopped', 'mixed', 'wrapped', 'served',
    'مشوي', 'مقلي', 'مطبوخ', 'محضر', 'متبل', 'مقطع', 'ملفوف', 'يقدم'
  ];

  /**
   * Common flavor descriptor keywords
   * @private
   */
  static FLAVOR_KEYWORDS = [
    'вкусн', 'аромат', 'сочн', 'нежн', 'хрустящ', 'пряный', 'острый', 'сладк',
    'соленый', 'кислый', 'пикант', 'насыщенн', 'богат', 'свеж', 'душист',
    'delicious', 'aromatic', 'juicy', 'tender', 'crispy', 'spicy', 'sweet',
    'savory', 'tangy', 'rich', 'fresh', 'flavorful', 'tasty',
    'لذيذ', 'عطري', 'طازج', 'حار', 'حلو', 'مالح', 'حامض', 'غني'
  ];

  /**
   * Sentence ending punctuation
   * @private
   */
  static SENTENCE_ENDINGS = ['.', '!', '?', '。', '！', '？'];

  /**
   * Check if description is complete (not empty, not null, not undefined)
   * @param {string} description - Description text to check
   * @returns {boolean} True if description exists and is not empty
   */
  isComplete(description) {
    if (!description || typeof description !== 'string') {
      return false;
    }
    
    const trimmed = description.trim();
    
    // Check if empty
    if (trimmed.length === 0) {
      return false;
    }
    
    // Check if truncated (ends mid-sentence)
    if (this.isTruncated(trimmed)) {
      return false;
    }
    
    return true;
  }

  /**
   * Check if description is truncated (ends mid-sentence or with ellipsis)
   * @param {string} description - Description text to check
   * @returns {boolean} True if truncated
   */
  isTruncated(description) {
    if (!description || typeof description !== 'string') {
      return true;
    }
    
    const trimmed = description.trim();
    
    // Check if empty
    if (trimmed.length === 0) {
      return true;
    }
    
    // Check for ellipsis indicators
    if (trimmed.endsWith('...') || trimmed.endsWith('…')) {
      return true;
    }
    
    // Check if ends with proper sentence ending punctuation
    const lastChar = trimmed[trimmed.length - 1];
    const endsWithPunctuation = DescriptionValidator.SENTENCE_ENDINGS.includes(lastChar);
    
    if (!endsWithPunctuation) {
      return true;
    }
    
    // Additional check: if very short (< 50 chars), likely truncated even with punctuation
    if (trimmed.length < 50) {
      return true;
    }
    
    return false;
  }

  /**
   * Validate description length (200-400 characters)
   * @param {string} description - Description text
   * @returns {boolean} True if length is 200-400 characters
   */
  isValidLength(description) {
    if (!description || typeof description !== 'string') {
      return false;
    }
    
    const length = description.trim().length;
    return length >= 200 && length <= 400;
  }

  /**
   * Check for required content elements (ingredients, preparation, flavor)
   * @param {string} description - Description text
   * @returns {ContentAnalysis} Analysis of content elements
   */
  analyzeContent(description) {
    const result = {
      hasIngredients: false,
      hasPreparation: false,
      hasFlavor: false,
      length: 0,
      isComplete: false,
      issues: []
    };
    
    if (!description || typeof description !== 'string') {
      result.issues.push('Description is null or not a string');
      return result;
    }
    
    const trimmed = description.trim();
    result.length = trimmed.length;
    
    // Normalize text for case-insensitive matching
    const normalized = trimmed.toLowerCase();
    
    // Check for ingredients
    result.hasIngredients = DescriptionValidator.INGREDIENT_KEYWORDS.some(
      keyword => normalized.includes(keyword.toLowerCase())
    );
    
    // Check for preparation methods
    result.hasPreparation = DescriptionValidator.PREPARATION_KEYWORDS.some(
      keyword => normalized.includes(keyword.toLowerCase())
    );
    
    // Check for flavor descriptors
    result.hasFlavor = DescriptionValidator.FLAVOR_KEYWORDS.some(
      keyword => normalized.includes(keyword.toLowerCase())
    );
    
    // Collect issues
    if (!this.isComplete(description)) {
      result.issues.push('Description is incomplete or truncated');
    }
    
    if (!this.isValidLength(description)) {
      if (result.length < 200) {
        result.issues.push(`Description too short (${result.length} chars, minimum 200)`);
      } else if (result.length > 400) {
        result.issues.push(`Description too long (${result.length} chars, maximum 400)`);
      }
    }
    
    if (!result.hasIngredients) {
      result.issues.push('No ingredient mentions detected');
    }
    
    if (!result.hasPreparation) {
      result.issues.push('No preparation method mentions detected');
    }
    
    if (!result.hasFlavor) {
      result.issues.push('No flavor descriptors detected');
    }
    
    // Overall completeness check
    result.isComplete = this.isComplete(description) 
      && this.isValidLength(description)
      && result.hasIngredients 
      && result.hasPreparation 
      && result.hasFlavor;
    
    return result;
  }

  /**
   * Validate a dish description against all requirements
   * @param {string} description - Description to validate
   * @returns {{valid: boolean, analysis: ContentAnalysis}} Validation result
   */
  validate(description) {
    const analysis = this.analyzeContent(description);
    
    return {
      valid: analysis.isComplete && analysis.issues.length === 0,
      analysis: analysis
    };
  }

  /**
   * Get a human-readable validation report
   * @param {string} description - Description to validate
   * @returns {string} Formatted validation report
   */
  getValidationReport(description) {
    const { valid, analysis } = this.validate(description);
    
    let report = `Description Validation Report\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Length: ${analysis.length} characters\n`;
    report += `Valid: ${valid ? 'YES' : 'NO'}\n`;
    report += `\n`;
    report += `Content Analysis:\n`;
    report += `  - Has Ingredients: ${analysis.hasIngredients ? '✓' : '✗'}\n`;
    report += `  - Has Preparation: ${analysis.hasPreparation ? '✓' : '✗'}\n`;
    report += `  - Has Flavor: ${analysis.hasFlavor ? '✓' : '✗'}\n`;
    report += `  - Is Complete: ${analysis.isComplete ? '✓' : '✗'}\n`;
    
    if (analysis.issues.length > 0) {
      report += `\n`;
      report += `Issues Found:\n`;
      analysis.issues.forEach((issue, index) => {
        report += `  ${index + 1}. ${issue}\n`;
      });
    }
    
    return report;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DescriptionValidator;
}

/**
 * @fileoverview Model exports for Shams Restaurant
 * @description Central export point for all data models
 */

// Import models (for module systems)
if (typeof require !== 'undefined') {
  var DishModel = require('./DishModel');
  var TranslationModel = require('./TranslationModel');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DishModel,
    TranslationModel
  };
}

// Models are already exported to window in their respective files
// This file ensures they're available through the models namespace as well
if (typeof window !== 'undefined') {
  window.Models = window.Models || {};
  window.Models.DishModel = window.DishModel;
  window.Models.TranslationModel = window.TranslationModel;
}

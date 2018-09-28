import Vue from 'vue';
import es from './es.js';

export default new (function () {
  
  var currentLanguage;
  const defaultLanguage = 'es';
  const dictionaries = {
    "es": es
  };
  const self = new Object();

  self.translate = function (literal) {
    return dictionaries[currentLanguage][literal] || ("lng-" + literal);
  };

  self.setLanguage = function (languaje) {
    currentLanguage = languaje instanceof String 
      && Object.keys(dictionaries).indexOf(languaje) >= 0 ? 
        languaje :
        defaultLanguage;
    
    return this;
  };

  self.__defineGetter__("currentLanguaje", function () {
    return currentLanguage;
  });

  self.setLanguage(defaultLanguage);

  window.lng = window.lng || self;
  Vue.prototype.lng = window.lng.translate;
  return window.lng;

})()
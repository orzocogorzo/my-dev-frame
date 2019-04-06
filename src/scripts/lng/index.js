import es from './es.js';
import en from './en.js';
import ca from './ca.js';
import html from './html/index.js';

export default function () {
  
  var currentLanguage;
  const defaultLanguage = 'en';
  const dictionaries = {
    "en": en,
    "es": es,
    "ca": ca
  };

  for (let key of Object.keys(dictionaries)) {
    if (html[key]) {
      Object.assign(dictionaries[key], html[key]);
    }
  }

  const regexLiteral = function (literal) {
    let match = literal.match(/<%([^%>]+)%>/);
    while (match) {
      literal = literal.replace(
        /<%[^%>]+%>/,
        currentLanguage[match[1].replace(/\s+/g,'')+'-learned'] || match[1].replace(/\s+/g,'')
      );
      match = literal.match(/<%([^%>]+)%>/);
    }

    return literal
  }

  const self = new Object();

  self.translate = function (literal) {
    let translation = globalEventBus.isPhoneFormat && currentLanguage[literal+'-mobile'] != null ? 
      currentLanguage[literal+'-mobile'] : currentLanguage[literal] != null ?  
        currentLanguage[literal] : ("lng-" + literal);
        
    return regexLiteral(translation)
  };

  self.setLanguage = function (languaje) {
    currentLanguage = typeof languaje === "string" 
      && Object.keys(dictionaries).indexOf(languaje) >= 0 ? 
      dictionaries[languaje] :
      dictionaries[defaultLanguage];
    
    return this;
  };

  self.currentLanguage = function () {
    return currentLanguage;
  }

  self.learn = function (dict) {
    Object.keys(dictionaries).map((lang) => {
      Object.keys(dict).map((k) => {
        dictionaries[lang][k+'-learned'] = dict[k];
      });
    });
  }

  self.setLanguage(defaultLanguage);

  self.bind = function (Class) {
    Class.prototype.$lng = self;
  }

  window.lng = window.lng || self;
  return window.lng;

};
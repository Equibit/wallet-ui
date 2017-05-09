import DefineMap from 'can-define/map/map';
import en from './en';
import fr from './fr';
import moment from 'moment';
import canBatch from 'can-event/batch/batch';

// Don't forget to load supported locales!
import 'moment/locale/fr';

let i18n = new DefineMap(en);

let userLang = typeof localStorage !== 'undefined' && localStorage.getItem('locale');
if (userLang){
  setLang(userLang);
}

function setLang(lang){
  let langOptions;
  switch (lang){
    case 'fr':
      langOptions = fr;
      break;
    default:
      langOptions = en;
  }
  canBatch.start();

  i18n.set(Object.assign({}, en, langOptions));

  // tell momentjs about new locale:
  moment.locale(lang);

  canBatch.stop();

  if (typeof localStorage !== 'undefined') localStorage.setItem('locale', lang);
}

function translate(term, silent){
  return i18n[term] || term + (silent ? '' : ' (!i18n!)');
}

window.setLang = setLang;

export default i18n;
export { setLang };
export { translate };
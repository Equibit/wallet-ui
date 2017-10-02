/**
 * @module helpers/i18n i18n
 * @parent helpers
 *
 * Helpers for internalization
 *
 * ## Use
 *
 * In a stache template use the following helper:
 * ```
 * <can-import from="~/utils/stache-helpers/" />
 *
 * <h2>{ {i18n('createAccount')}}</h2>
 * ```
 *
 * In a view model import the DefineMap instance or the `translate` function:
 * ```
 * import i18n from "~/i18n/";
 * // OR:
 * import { translate } from "~/i18n/";
 *
 * hub.dispatch({
 *    "title": i18n.accountCreated
 *    // OR:
 *    "message": translate("accountCreatedMsg")
 * });
 * ```
 *
 * To change language from a VM use `setLang` function:
 * ```
 * import { setLang } from "i18n";
 *
 * {
 *     changeLanguage (lang) {
 *         setLang(lang)
 *     }
 * }
 * ```
 */

import DefineMap from 'can-define/map/map'
import en from './en'
import fr from './fr'
import moment from 'moment'
import canBatch from 'can-event/batch/batch'

// Don't forget to load supported locales!
import 'moment/locale/fr'

let i18n = new DefineMap(en)
const localStorage = typeof window !== 'undefined' && window.localStorage || undefined

let userLang = localStorage && localStorage.getItem('locale')
if (userLang) {
  setLang(userLang)
}

function setLang (lang) {
  let langOptions
  switch (lang) {
    case 'fr':
      langOptions = fr
      break
    default:
      langOptions = en
  }
  canBatch.start()

  i18n.set(Object.assign({}, en, langOptions))

  // tell momentjs about new locale:
  moment.locale(lang)

  canBatch.stop()

  if (typeof localStorage !== 'undefined') localStorage.setItem('locale', lang)
}

function translate (term, silent) {
  return i18n[term] || term + (silent ? '' : ' (!i18n!)')
}

if (typeof window !== 'undefined') {
  window.setLang = setLang
}

export default i18n
export { setLang }
export { translate }

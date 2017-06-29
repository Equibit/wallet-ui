import stache from 'can-stache'
import i18n from '~/i18n/'

stache.registerHelper('i18n', function (key) {
  if (typeof i18n[key] !== 'undefined') return i18n[key]
  else return key
})

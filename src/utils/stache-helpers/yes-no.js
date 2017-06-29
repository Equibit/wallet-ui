import stache from 'can-stache'
import i18n from '~/i18n/i18n'

stache.registerHelper('yes-no', function (value) {
  return value ? i18n.yes : i18n.no
})

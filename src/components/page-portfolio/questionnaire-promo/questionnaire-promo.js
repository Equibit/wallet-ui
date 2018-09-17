/**
 * @module {can.Component} wallet-ui/questionnaire-promo questionnaire-promo
 * @parent components.common
 *
 * A short description of the questionnaire-promo component
 *
 * @signature `<questionnaire-promo />`
 *
 * @link ../src/wallet-ui/questionnaire-promo/questionnaire-promo.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/questionnaire-promo/questionnaire-promo.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './questionnaire-promo.less'
import view from './questionnaire-promo.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the questionnaire-promo component'
  }
})

export default Component.extend({
  tag: 'questionnaire-promo',
  ViewModel,
  view
})

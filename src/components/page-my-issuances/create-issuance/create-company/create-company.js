/**
 * @module {can.Component} components/page-my-issuances/create-issuance/create-company create-company
 * @parent components.common
 *
 * Shows the form to create a company
 *
 * @signature `<create-company />`
 *
 * @link ../src/components/page-my-issuances/create-issuance/create-company/create-company.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-my-issuances/create-issuance/create-company/create-company.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-company.less'
import view from './create-company.stache'
import Company from '../../../../models/company'
import Session from '../../../../models/session'

export const ViewModel = DefineMap.extend({
  company: {
    Type: Company,
    value: new Company({
      userId: Session.current.user._id
    })
  }
})

export default Component.extend({
  tag: 'create-company',
  ViewModel,
  view
})

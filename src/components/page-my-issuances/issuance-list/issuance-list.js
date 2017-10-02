/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/issuance-list issuance-list
 * @parent components.common
 *
 * A short description of the issuance-list component
 *
 * @signature `<issuance-list />`
 *
 * @link ../src/wallet-ui/components/page-my-issuances/issuance-list/issuance-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/issuance-list/issuance-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './issuance-list.less'
import view from './issuance-list.stache'

export const ViewModel = DefineMap.extend({
  isModalShown: 'boolean',
  issuances: '*',
  issuanceByCompany: {
    get () {
      const byCompany = this.issuances.reduce((acc, issuance) => {
        if (!acc[issuance.companyName]) {
          acc[issuance.companyName] = []
        }
        acc[issuance.companyName].push(issuance)
        return acc
      }, {})
      return Object.keys(byCompany).reduce((acc, companyName) => {
        acc.push({
          companyName: byCompany[companyName][0].companyName,
          domicile: byCompany[companyName][0].domicile,
          issuances: byCompany[companyName]
        })
        return acc
      }, [])
    }
  },
  showModal () {
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'issuance-list',
  ViewModel,
  view
})

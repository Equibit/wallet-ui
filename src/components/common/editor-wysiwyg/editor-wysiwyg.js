/**
 * @module {can.Component} wallet-ui/components/common/editor-wysiwyg editor-wysiwyg
 * @parent components.common
 *
 * A short description of the editor-wysiwyg component
 *
 * @signature `<editor-wysiwyg />`
 *
 * @link ../src/wallet-ui/components/common/editor-wysiwyg/editor-wysiwyg.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/editor-wysiwyg/editor-wysiwyg.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './editor-wysiwyg.less'
import view from './editor-wysiwyg.stache'
import $ from 'jquery'
import 'summernote'

export const ViewModel = DefineMap.extend({
  config: {
    type: '*',
    value () {
      return {}
    }
  }
})

export default Component.extend({
  tag: 'editor-wysiwyg',
  ViewModel,
  view,
  events: {
    inserted (el) {
      console.log('this.viewModel.config', this.viewModel.config)
      $(el).find('.summernote-container').summernote(this.viewModel.config)
    }
  }
})

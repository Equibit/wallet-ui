/**
 * @module {can.Component} components/common/progress-tracker progress-tracker
 * @parent components.common
 *
 * This components allows to show the progress of process. Uses the styles from
 * [progress-tracker.less](_progress-tracker.less.html)
 *
 * @signature `<progress-tracker />`
 *
 * @link ../src/components/common/progress-tracker/progress-tracker.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/progress-tracker/progress-tracker.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './progress-tracker.less';
import view from './progress-tracker.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the progress-tracker component'
  }
});

export default Component.extend({
  tag: 'progress-tracker',
  ViewModel,
  view
});

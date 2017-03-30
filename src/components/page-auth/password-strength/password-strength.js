import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './password-strength.scss';
import view from './password-strength.stache';
import zxcvbn from 'zxcvbn';

export const ViewModel = DefineMap.extend({
  password: 'string',
  get score() {
    return this.password && zxcvbn(this.password).score;
  }
});

export default Component.extend({
  tag: 'password-strength',
  ViewModel,
  view
});

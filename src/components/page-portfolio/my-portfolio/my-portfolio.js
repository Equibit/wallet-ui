/**
 * @module {can.Component} wallet-ui/components/page-portfolio/my-portfolio my-portfolio
 * @parent components.portfolio
 *
 * A short description of the my-portfolio component
 *
 * @signature `<my-portfolio />`
 *
 * @link ../src/components/page-portfolio/my-portfolio/my-portfolio.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/my-portfolio/my-portfolio.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './my-portfolio.less';
import view from './my-portfolio.stache';
import hub from '~/utils/event-hub';
import { translate } from '~/i18n/';
import Portfolio from '~/models/portfolio';

export const ViewModel = DefineMap.extend({
  portfolio: {
    value: null
    // value: {
    //   balance: 22.616393,
    //   totalCash: 12.616393,
    //   totalSec: 10.00045,
    //   unrealizedPL: 0.109,
    //   unrealizedPLPercent: 1.2
    // }
  },
  isSending: 'boolean',
  isSendFundsPopup: 'boolean',
  isReceiveFundsPopup: 'boolean',
  receiveFunds () {
    this.isReceiveFundsPopup = false;
    this.isReceiveFundsPopup = true;
  },
  receiveDone () {
    this.isReceiveFundsPopup = false;
    // TODO: portfolio has to be created and keys generated to show the address in the receive popup.
    if (!this.portfolio) {
      this.portfolio = new Portfolio();
    }
    // this.portfolio.save().then(portfolio => {
    //   const portfolioIndex = portfolio.index;
    //   const keys = this.user.generatePortfolioKeys(portfolioIndex);
    //   portfolio.keys = keys;
    // });
  },
  send (args) {
    const formData = args[1];
    console.log('send: ', formData);

    // Show the spinner:
    this.isSending = true;

    // Close the popup:
    this.isSendFundsPopup = false;

    // TODO: send request here.

    setTimeout(() => {
      this.isSending = false;

      const msg = this.type === 'SECURITIES' ? translate('securitiesSent') : translate('fundsSent');
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': msg,
        'displayInterval': 5000
      });
    }, 1000);
  }
});

export default Component.extend({
  tag: 'my-portfolio',
  ViewModel,
  view
});

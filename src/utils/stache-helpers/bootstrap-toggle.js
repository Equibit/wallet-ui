import $ from 'jquery';
import canViewCallbacks from 'can-view-callbacks';

canViewCallbacks.attr('data-toggle', function(el, attrData){
  var toggleType = el.getAttribute('data-toggle');

  setTimeout(() => {
    $(el)[toggleType]();
  })
});
import stache from 'can-stache';

stache.registerHelper('sort-arrow', function (value) {
  let className = '';
  switch (value) {
    case undefined:
    case null:
      className = 'icon-sort';
      break;
    case 1:
    case 'asc':
    case true:
      className = 'icon-arrow';
      break;
    default:
      className = 'icon-arrow rotate-180';
  }
  return `<span class="icon ${className}"></span>`;
});

import stache from 'can-stache';

let ascVals = [true, 1, 'asc'];
let isAsc = function (value) {
  return ascVals.indexOf(value) !== -1;
};

stache.registerHelper('sort-arrow', function (value) {
  if (typeof value === 'undefined'){
    return '<span class="arrow no-dir">△▽</span>';
  }
  let asc = isAsc(value);
  let arrow = asc  ? '△' : '▽';
  let className = asc ? 'asc' : 'desc';
  return `<span class="arrow arrow-${className}">${arrow}</span>`;
});


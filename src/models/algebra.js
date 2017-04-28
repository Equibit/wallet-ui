import set from 'can-set';
// import moment from 'moment';
import helpers from 'can-set/src/helpers';

export default new set.Algebra(
  set.comparators.id('_id'),
  set.props.offsetLimit('$skip', '$limit'),
  set.comparators.sort('$sort', mongoSort)
  // set.comparators.sort('$sort', function ($sort, cm1, cm2) {
  //   if ($sort.date) {
  //     if (parseInt($sort.date, 10) === 1) {
  //       return moment(cm1.date).toDate() - moment(cm2.date).toDate();
  //     }
  //     return moment(cm2.date).toDate() - moment(cm1.date).toDate();
  //   }
  //   if ($sort.change) {
  //
  //   }
  //   throw new Error("can't sort that way");
  // })

  // {
  //   '$populate': function () {
  //     return true;
  //   },
  //   'token': function () {
  //     // token is added by feathers
  //     return true;
  //   }
  // }
);

// TODO: this should belong to can-set module: `can-set/src/helpers.defaultSort`
// See this PR: https://github.com/canjs/can-set/pull/25/commits/b744d23cba7bccd694a858853560c7d816b26f42
// Gives back the value of an object at a provided dot-separated path string.
function getValueFromPath (obj, path) {
  path = path.split('.');
  for (var i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}
helpers.getValueFromPath = getValueFromPath;
function mongoSort (sortPropValue, item1, item2) {
  var parts = [];
  var sortProp;
  var item1Value;
  var item2Value;
  var desc;

  if (typeof sortPropValue === 'string') {
    parts = sortPropValue.split(' ');
    sortProp = parts[0];
    item1Value = item1[sortProp];
    item2Value = item2[sortProp];
    desc = parts[1] || '';
    desc = desc.toLowerCase() === 'desc';
  } else {
    var path = Object.keys(sortPropValue)[0];
    var sortDir = sortPropValue[Object.keys(sortPropValue)[0]];
    if (sortDir === -1 || sortDir === '-1') {
      desc = true;
    }

    item1Value = helpers.getValueFromPath(item1, path);
    item2Value = helpers.getValueFromPath(item2, path);
  }

  if (desc) {
    var temp;
    temp = item1Value;
    item1Value = item2Value;
    item2Value = temp;
  }

  if (item1Value < item2Value) {
    return -1;
  }

  if (item1Value > item2Value) {
    return 1;
  }

  return 0;
}

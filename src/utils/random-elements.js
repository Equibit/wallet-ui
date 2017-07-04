import { zip } from 'ramda'

/**
 * Returns an object with random indexes of the list and the corresponding values
 * @param {Array|DefineList} list
 * @param {Number} howMany
 * @returns {Object<indexes, values>}
 */
function randomElements(list, howMany) {
  const indexes = shuffle(Array.from(new Array(list.length), (a, i) => i)).slice(0, howMany)
  const values = pickFromList(indexes, list)
  return { indexes, values }
}

/**
 * Returns a sublist of the given list with the given indexes. Uses `constructor` property of the list.
 * @param indexes
 * @param {Array|canDefineList} list
 * @returns {list.constructor}
 */
function pickFromList (indexes, list) {
  return indexes.reduce((acc, i) => {
    acc.push(list[i])
    return acc
  }, new list.constructor())
}

/**
 * Shuffles an array. Mutates the array, be sure to pass a copy if you don't want to mutate the original one.
 * @param {Array} array
 * @returns {Array}
 */
function shuffle (array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export default randomElements
export { shuffle, pickFromList }
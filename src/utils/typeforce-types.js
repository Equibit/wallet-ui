module.exports = {
  instanceOf: function (ConstructorFn) {
    return function instanceOf (value) {
      return value instanceof ConstructorFn
    }
  },
  isKeyPair (value) {
    return !!value
  }
}

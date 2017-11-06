module.exports = {
  instanceOf: function (ConstructorFn) {
    return function instanceOf (value) {
      return value instanceof ConstructorFn
    }
  },
  KeyPair (value) {
    return !!(value && value.getPublicKeyBuffer)
  }
}

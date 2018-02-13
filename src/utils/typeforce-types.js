const txIdRe = /[\w]{32}/

module.exports = {
  instanceOf: function (ConstructorFn) {
    return function instanceOf (value) {
      return value instanceof ConstructorFn
    }
  },
  KeyPair (value) {
    return !!(value && value.getPublicKeyBuffer)
  },
  // Transaction ID is a 256 bit hex value:
  TxId (value) {
    // String of 64 chars (which is 32 bytes in hex, which is 256 bits):
    return txIdRe.test(value)
  }
}

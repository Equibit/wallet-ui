const emailRegex = /.+@.+\..+/i;

export default {
  email (value, { allowEmpty }) {
    return (!allowEmpty && !value && 'Email is missing') ||
      (value && !emailRegex.test(value) && 'Enter a valid email address') || '';
  },
  password (value, { allowEmpty }) {
    return (!allowEmpty && !value && 'Password is missing') || '';
  },
  terms (value) {
    return (!value && 'You need to read and agree to our Terms & Conditions and Privacy Policy') || '';
  }
};

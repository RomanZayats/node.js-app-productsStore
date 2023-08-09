module.exports = {
  ifeq(a, b, options) {
    return a.toString() === b.toString()
      ? options.fn(this)
      : options.inverse(this);
  },
};

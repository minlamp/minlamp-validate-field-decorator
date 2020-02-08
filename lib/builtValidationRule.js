var BuildValidationRule = {
  required: function required(value) {
    return value !== '';
  },
  isNumber: function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
  },
  isString: function isString(value) {
    return typeof value === 'string';
  },
  max: function max(value, maxNumber) {
    return this.isNumber(Number(value)) && value <= maxNumber;
  },
  min: function min(value, minNumber) {
    return this.isNumber(Number(value)) && value >= minNumber;
  }
};
export default BuildValidationRule;
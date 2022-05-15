const { isValidObjectId } = require('mongoose');

module.exports.objectId = (value, helper) => {
  if (isValidObjectId(value)) {
    return value;
  }

  return helper.error('any.invalid');
};

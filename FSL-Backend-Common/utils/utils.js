/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable  no-multi-assign */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-restricted-globals */

exports.validateMobileNumber = number => (!!((parseInt(number) && number.length === 10)));

exports.isValidDate = dateStr => !isNaN(new Date(dateStr).getDate());

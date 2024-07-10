"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const asyncHandler = (fn) => (req, res, next) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { getInfoData, asyncHandler };

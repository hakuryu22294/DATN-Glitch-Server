"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};
const removeUndifined = (object = {}) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined) delete object[key];
  });
  return object;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);

      Object.keys(response).forEach((a) => {
        final[k + "." + a] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const convertToObjectId = (id) => {
  return Types.ObjectId(id);
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndifined,
  updateNestedObjectParser,
  convertToObjectId,
};

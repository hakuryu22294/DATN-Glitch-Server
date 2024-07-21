const { Template } = require("../models/template.shcema");
const htmlEmailToken = require("../utils/verify.html");

const newTemplate = async ({ tempName, tempHTML, tempId }) => {
  const templateExist = await Template.findOne({ tempName, tempId }).lean();
  if (templateExist) {
    throw new BadRequestError("Template already exist");
  }
  const newTemplate = await Template.create({
    tempName,
    tempHTML: htmlEmailToken(),
    tempId,
  });
  return newTemplate;
};

const getTemplate = async ({ tempName }) => {
  const template = await Template.findOne({ tempName });

  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};

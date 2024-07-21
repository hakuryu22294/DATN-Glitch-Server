const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");
const transport = require("../dbs/init.nodemailer");
const { BadRequestError } = require("../core/error.response");
const { replaceHolder } = require("../utils");

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "Verify email",
}) => {
  try {
    const emailOptions = {
      from: '"Glitch Service" <quanghack12b@gmail.com>',
      to: toEmail,
      subject,
      html,
    };
    transport.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Email sent: " + info.messageId);
    });
  } catch (error) {
    console.log(`error send email:: ${error}`);
    return error;
  }
};
const sendEmailToken = async ({ email = null, password }) => {
  try {
    const getToken = await newOtp({ email, password });
    //get template
    const template = await getTemplate({ tempName: "HTML mail token" });
    if (!template) {
      throw new BadRequestError("Template not found");
    }

    const content = replaceHolder(template.tempHTML, {
      link_verify: `http://localhost:5173/verify?token=${getToken.otpToken}`,
    });

    sendEmailLinkVerify({
      toEmail: email,
      subject: "Verify email Register Glitch service",
      html: content,
    }).catch((error) => {
      throw error;
    });
    return 1;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendEmailToken,
};

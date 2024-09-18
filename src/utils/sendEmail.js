const transporter = require("../configs/mail.configs");
require("dotenv").config();
const sendEmail = async (to, subject, text) => {
  let mailOption = {
    from: `"Cửa hàng của bạn" <${process.env.SMTP_USER}>`, // Người gửi (từ email đã cấu hình)
    to: to, // Người nhận
    subject: subject, // Tiêu đề email
    text: text, // Nội dung email
  };

  try {
    await transporter.sendMail(mailOption);
    console.log(`Email đã gửi đến ${to}`);
  } catch (error) {
    console.error("Gửi email thất bại:", error);
  }
};

module.exports = sendEmail;

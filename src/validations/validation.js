import * as Yup from "yup";

// Regex tùy chỉnh cho email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regex cho xác thực mật khẩu: ít nhất 6 ký tự, không có ký tự đặc biệt
const passwordRegex = /^[A-Za-z\d]{6,20}$/;

export const validationLoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, "Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Mật khẩu phải từ 6-20 ký tự và chỉ bao gồm chữ cái và số"
    )
    .required("Mật khẩu là bắt buộc"),
});

export const validationRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Tên là bắt buộc")
    .min(3, "Tên quá ngắn")
    .max(50, "Tên quá dài"),
  email: Yup.string()
    .matches(emailRegex, "Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Mật khẩu phải từ 6-20 ký tự và chỉ bao gồm chữ cái và số"
    )
    .required("Mật khẩu là bắt buộc"),
});

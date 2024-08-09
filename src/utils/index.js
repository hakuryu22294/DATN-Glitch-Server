import axios from "axios";
export const overrideStyle = {
  display: "flex",
  margin: "0 auto",
  height: "24px",
  justifyContent: "center",
  alignItems: "center",
};
export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const getProvince = async () => {
  const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
  console.log(response.data);
  return response.data;
};

export const getDistrict = async () => {
  const response = await axios.get("https://esgoo.net/api-tinhthanh/2/01.htm");

  return response.data;
};

export const getWard = async () => {
  const response = await axios.get("https://esgoo.net/api-tinhthanh/3/001.htm");

  return response.data;
};

export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

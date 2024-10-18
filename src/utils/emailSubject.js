const customerOrderConfirm = (orderId, customerName) => {
  return `Kính gửi ${
    customerName || "Quý Khách"
  },\n\nChúng tôi xin thông báo rằng đơn hàng của bạn với mã số ${orderId} đã được đặt thành công.\n\nCảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Chúng tôi sẽ sớm xử lý và giao hàng đến bạn. Bạn có thể kiểm tra tình trạng đơn hàng của mình qua tài khoản cá nhân hoặc liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào.\n\nTrân trọng,\nĐội ngũ Hỗ trợ Khách hàng\n[Glitch - Ecommerce]`;
};

const sellerOrderConfirm = (orderId, sellerName) => {
  return `Kính gửi ${
    sellerName || "Quý Người Bán"
  },\n\nChúng tôi xin thông báo rằng bạn đã nhận được một đơn hàng mới với mã số ${orderId}.\n\n. Vui lòng kiểm tra chi tiết đơn hàng trong hệ thống của bạn và chuẩn bị để giao hàng.\n\nNếu có bất kỳ câu hỏi nào hoặc cần thêm thông tin, vui lòng liên hệ với chúng tôi.\n\nTrân trọng,\nĐội ngũ Hỗ trợ Khách hàng\n[Glitch - Ecommerce]`;
};
const customerOrderAssigned = (orderId, customerName) => {
  return `Kính gửi ${customerName || "Quý Khách"},
    Chúng tôi xin thông báo rằng đơn hàng của bạn với mã số ${orderId} đã được bàn giao cho shipper.\n\nVui lòng giữ liên lạc với chúng tôi.\n\nTrân trọng,\nĐội ngũ Hỗ trợ Khách hàng\n[Glitch - Ecommerce]`;
};

const shipperMessage = (shipperName, numberOrder, sellerName) => {
  return `Kính gửi ${shipperName || "Shipper"},
  Bạn đã nhận được ${numberOrder} đơn hàng từ  ${sellerName}
  `;
};

const customerReceived = (orderId, customerName) => {
  return `Kính gửi ${customerName || "Quý Khách"},
  Chúng tôi xin thông báo rằng đơn hàng của bạn với mã số ${orderId} đã được giao thành công. Vui lòng bấm xác nhận và đánh giá về dịch vụ của chúng tôi. Xin chân thành cảm ơn
`;
};
const sellerReceived = (orderId, sellerName) => {
  return `Kính gửi ${sellerName || "Quý Người Bán"},
  Chúng tôi xin thông báo rằng đơn hàng của bạn với mã số ${orderId} đã được giao thành công đến tay khách hàng. `;
};

const orderCancelled = (orderId, customerName) => {
  return `Kính gửi ${customerName || "Quý Khách"},
  Chúng tôi xin được huy đơn hàng của bạn với lý do không đủ hàng.\n
  Chúng tôi vô cùng xin lỗi vì sự bất tiện này\n
  Kính mong bạn vẫn tiếp tục ủng hộ chúng tôi
  `;
};
const productRemoved = (orderId, customerName, productName) => {
  return `Kính gửi ${customerName || "Quý Khách"},
  Chúng tôi xin phép được thông báo rắng sản phẩm ${productName} đã bán hết nên đã bị remove khỏi đơn hàng ${orderId} của bạn. Chúng tôi xin lỗi vì sự bất tiện này
  `;
};
module.exports = {
  customerOrderConfirm,
  sellerOrderConfirm,
  customerOrderAssigned,
  shipperMessage,
  customerReceived,
  sellerReceived,
  orderCancelled,
  productRemoved,
  orderCancelled,
  productRemoved,
};

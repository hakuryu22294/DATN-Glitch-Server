const customerOrderConfirm = (orderId, customerName) => {
  return `Kính gửi ${
    customerName || "Quý Khách"
  },\n\nChúng tôi xin thông báo rằng đơn hàng của bạn với mã số ${orderId} đã được xác nhận thành công.\n\nCảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Chúng tôi sẽ sớm xử lý và giao hàng đến bạn. Bạn có thể kiểm tra tình trạng đơn hàng của mình qua tài khoản cá nhân hoặc liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào.\n\nTrân trọng,\nĐội ngũ Hỗ trợ Khách hàng\n[Glitch - Ecommerce]`;
};

const sellerOrderConfirm = (orderId, sellerName) => {
  return `Kính gửi ${
    sellerName || "Quý Người Bán"
  },\n\nChúng tôi xin thông báo rằng bạn đã nhận được một đơn hàng mới với mã số ${orderId}.\n\nĐơn hàng đã được xác nhận và thanh toán thành công. Vui lòng kiểm tra chi tiết đơn hàng trong hệ thống của bạn và chuẩn bị để giao hàng.\n\nNếu có bất kỳ câu hỏi nào hoặc cần thêm thông tin, vui lòng liên hệ với chúng tôi.\n\nTrân trọng,\nĐội ngũ Hỗ trợ Khách hàng\n[Glitch - Ecommerce]`;
};

module.exports = { customerOrderConfirm, sellerOrderConfirm };

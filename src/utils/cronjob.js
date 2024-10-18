const cron = require("node-cron");
const moment = require("moment");
const Order = require("../models/order.schema");
const sendEmail = require("./sendEmail");

// Cron job chạy hàng ngày vào 00:00 (nửa đêm)
const cronScheduleOrder = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const threeDaysAgo = moment().subtract(3, "days").toDate();

      const ordersToUpdate = await Order.find({
        deliveryStatus: "delivered",
        orderStatus: "waiting_receive",
        completeDeliveryDate: { $lte: threeDaysAgo },
      }).populate({ path: "customerId", select: "email" });

      for (const order of ordersToUpdate) {
        order.orderStatus = "completed";
        await order.save();
        console.log(
          `Đã cập nhật trạng thái đơn hàng ${order._id} thành "complete"`
        );
        await sendEmail(
          order.customerId.email,
          "Xác nhận đơn hàng hoàn tất",
          `Đơn hàng ${order._id} của bạn đã hoàn tất.`
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng tự động:", error);
    }
  });
};

module.exports = cronScheduleOrder;

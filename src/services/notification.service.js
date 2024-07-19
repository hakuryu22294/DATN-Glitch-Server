const pushNotiToSystem = async ({
  type = "SHOP_001",
  receiverId = 1,
  senderId = 1,
  options = {},
}) => {
  let notiContent;
  if (type === "SHOP_001") {
    notiContent = "@@@ vừa nhận 1 sản phẩm: @@@";
  } else if (type === "PROMOTION-001") {
    notiContent = "@@@ vừa nhân 1 voucher: @@@";
  }
  const newNoti = await Notification.create({
    type,
    receiverId,
    senderId,
    notiContent,
    options,
  });
  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = {
    receiverId: userId,
  };
  if (type !== "ALL") {
    match.type = type;
  }
  return await Notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        type: 1,
        senderId: 1,
        receiverId: 1,
        notiContent: 1,
        createAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
};

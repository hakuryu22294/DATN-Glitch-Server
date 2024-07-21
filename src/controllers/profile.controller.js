const { SuccessResponse } = require("../core/success.response");

const profiles = [
  {
    userId: 1,
    username: "Storm",
    userAvatar: "https://i.pravatar.cc/300",
  },
  {
    userId: 2,
    username: "Ember",
    userAvatar: "https://i.pravatar.cc/300",
  },
  {
    userId: 3,
    username: "Void",
    userAvatar: "https://i.pravatar.cc/300",
  },
];
class ProfileController {
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: "View All Profile",
      metadata: profiles,
    }).send(res);
  };

  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "View Profile",
      metadata: {
        userId: 2,
        username: "Ember",
        userAvatar: "https://i.pravatar.cc/300",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();

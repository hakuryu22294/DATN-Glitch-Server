const { Admin } = require("../models/admin.schema");

class AccessController {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    const admin = Admin.findOne({ email });
    if (!admin) throw new BadRequestError("Admin don't exists");
  };
}

module.exports = new AccessController();

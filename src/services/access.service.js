const shopSchema = require("../models/shop.schema");
const bcrypt = require("bcryptjs");
const {
  createTokenPair,
  verifyJWT,
  getTokenFromHeader,
} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { Blacklist } = require("../models/blacklist.schema");
require("dotenv").config();

class AccessService {
  static signUp = async ({ name, email, password }) => {
    //check email exist
    const hodelShop = await shopSchema.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Shop already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopSchema.create({
      name,
      email,
      password: hashPassword,
      role: "shop",
    });
    if (newShop) {
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        process.env.SECRET_KEY
      );
      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    throw new BadRequestError("Can not create shop");
  };
  static signIn = async ({ email, password }) => {
    //check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");
    //match password
    const matchPassword = await bcrypt.compare(password, foundShop.password);
    if (!matchPassword) throw new UnauthorizedError("Wrong password");
    //create access token and refresh token and save
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      process.env.SECRET_KEY
    );
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
    //generate tokens
    //get data return login
  };
  static logout = async (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    console.log(token);
    await Blacklist.create({ key: token });
  };

  //check token used
}

module.exports = AccessService;

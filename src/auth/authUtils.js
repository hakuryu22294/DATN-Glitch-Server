const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.log(`error verify access token:: ${err}`);
      else console.log(`decode token:: ${decode}`);
    });
    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};

module.exports = { createTokenPair };

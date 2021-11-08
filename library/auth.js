const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWTD = require("jwt-decode");

const secret = "madamanchi1995harish";

const hashing = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

const hashCompare = async (password, hashPwd) => {
  try {
    return await bcrypt.compare(password, hashPwd);
  } catch (error) {
    return error;
  }
};

const JWTForLogin = async ({ email }) => {
  return await JWT.sign(
    {
      email,
    },
    secret,
    {
      expiresIn: "3h",
    }
  );
};

const checkJWTTokenValidity = async (token) => {
  const decodeToken = JWTD(token);
  if (Math.round(new Date() / 1000) <= decodeToken.exp) {
    return true;
  }
  return false;
};

module.exports = { hashing, hashCompare, JWTForLogin, checkJWTTokenValidity };

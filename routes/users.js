var express = require("express");
var router = express.Router();

var { mongoDB, mongoClient, MONGOURL } = require("../dbConfig");
var {
  hashing,
  hashCompare,
  JWTForLogin,
  checkJWTTokenValidity,
} = require("../library/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//register routes
router.post("/register", async (req, res) => {
  const client = await mongoClient.connect(MONGOURL);
  try {
    const db = client.db("Urlshortner");
    const user = await db
      .collection("users")
      .findOne({ Email: req.body.Email });
    if (user) {
      res.send({
        message: "User Already Exists",
      });
    } else {
      const hashPwd = await hashing(req.body.Password);
      req.body.Password = hashPwd;
      const data = await db.collection("users").insertOne(req.body);

      // const token =
      if (data.acknowledged) {
        res.send({
          message: "Account Created!! Login to continue",
        });
      }
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

// login route
router.post("/login", async (req, res) => {
  const client = await mongoClient.connect(MONGOURL);
  try {
    const db = client.db("Urlshortner");
    const user = await db
      .collection("users")
      .findOne({ Email: req.body.Email });
    if (!user) {
      res.send({
        message: "Email or Password Incorrect",
      });
    } else {
      if (user.Status) {
        const hashPwd = user.Password;
        const pwdCompare = await hashCompare(req.body.Password, hashPwd);
        if (pwdCompare) {
          const token = await JWTForLogin({
            email: user.Email,
          });
          let details = await db
            .collection("users")
            .updateOne({ Email: user.email }, { $set: { token: token } });
          res.status(200).send({
            token: token,
            email: user.Email,
            message: "Login Successfull",
          });
        }
      } else {
        res.send({ message: "Please Activate your Account" });
      }
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

module.exports = router;

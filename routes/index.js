var express = require("express");
var router = express.Router();

const { mongoDB, mongoClient, MONGOURL } = require("../dbConfig");
const { nanoId } = require("nanoid");
var { checkJWTTokenValidity } = require("../library/auth");

/* GET home page. */
router.get("/get-all/:email", async (req, res) => {
  let Email = req.params.email;

  const client = await mongoClient.connect(MONGOURL);

  try {
    const db = client.db("Urlshortner");
    const urlData = await db.collection("users").findOne({ Email: Email });
    res.status(200).send({ Data: urlData.shortners });
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.get("get-detail/:shorturl", async (req, res) => {
  const shortURL = req.params.shorturl;
  const Email = req.body.Email;
  const client = await mongoClient.connect(MONGOURL);

  try {
    const db = client.db("Urlshortner");
    const urlData = await db.collection("users").findOne({ Email: Email });
    const singleData = urlData.shortners.filter((urlObject) => {
      urlObject.shortURL === shortURL;
    });
    res.send({ Data: singleData[0] });
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("create-url", async (req, res) => {
  const Email = req.body.Email;
  const client = await mongoClient.connect(MONGOURL);
  try {
    const db = client.db("Urlshortner");
    const user = await db.collection("users").findOne({ Email: Email });
    const shortenArray = user.shortners;
    shortenArray.push({
      longURL: req.body.longURL,
      shortURL: nanoId(6),
      creationTime: new Date(),
    });
    const updateShortenArray = await db
      .collection("users")
      .updateOne({ Email: Email }, { $set: { shortners: shortenArray } });
    res.status(200).send({ message: "url is shortened" });
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.get("/redirect/:url", async (req, res) => {
  const shortURL = req.params.url;
  const Email = req.body.Email;
  const client = await mongoClient.connect(MONGOURL);

  try {
    const db = client.db("Urlshortner");
    const getuser = await db.collection("users").findOne({ Email: Email });
    const singleURLData = getuser.shortners.filter((urlObject) => {
      urlObject.shortURL === shortURL;
    });
    if (singleURLData.length > 0) {
      res.redirect(singleURLData[0].longURL);
    } else {
      res.send({ message: "URLis not found start creating it!" });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

module.exports = router;

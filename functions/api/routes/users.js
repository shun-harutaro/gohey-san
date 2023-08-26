const express = require("express");
const router = express.Router();
const axios = require("axios");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

//const { defineString } = require("firebase-functions/params");
//const clientId = defineString("CLIENT_ID");
const serviceAccount = require("../../credential.json");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

const validateUserId = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  if (doc.exists) {
    console.log("Document data:", doc.data());
    return true;
  }
  return false;
};

const register = async(profile) => {
  const data = {
    name: profile.name,
    picture: profile.picture
  }
  const userId = profile.sub;
  try {
    const res = await db.collection("users").doc(userId).set(data);
    console.log(res);
  } catch(err) {
    console.log(err);
  }
}

const validateToken = async (idToken) => {
  try {
    const resValidateToken = await axios
      .post(
        "https://api.line.me/oauth2/v2.1/verify",
        {
          id_token: idToken,
          client_id: process.env.CLIENT_ID,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
    return resValidateToken;
  } catch (err) {
    console.log(err.response.data);
    //return new Error("Failed to verify IDtoken " + err.message);
    throw "Failed to verify IDtoken " + err.message;
  }
};


router.get("/:idToken", async (req, res) => {
  const idToken = req.params.idToken;
  try {
    const resValidateToken = await validateToken(idToken);
    const userId = resValidateToken.data.sub;
    const isResistered = await validateUserId(userId);
    if (isResistered) {
      res.send("OK");
    } else {
      res.status(404).send("the given userId was not found");
    }
  } catch(err) {
    res.status(400).send("idToken is invalid");
  }
});

router.post("/register/:idToken", async(req, res) => {
  const idToken = req.params.idToken;
  try {
    const resValidateToken = await validateToken(idToken);
    const profile = resValidateToken.data;
    const result = await register(profile);
    res.send("Register success");
  } catch(err) {
    res.status(400).send("Error to register")
  }
})

module.exports = router;

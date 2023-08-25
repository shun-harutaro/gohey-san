const express = require("express");
const router = express.Router();
const axios = require("axios");
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const {getFirestore, Timestamp, FieldValue, Filter} = require("firebase-admin/firestore");
const NODE_ENV = process.env.NODE_ENV;
const envPath = NODE_ENV==="development" ? ".env.local" : ".env";
require("dotenv").config({ path: envPath })
const serviceAccount = require("../../credential.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const isResistered = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  if (doc) {
    console.log('Document data:', doc.data());
    return true;
  }
  return false;
}

router.get("/:idToken", (req, res) => {
  (async() => {
    try{
      const profile = await axios
        .post(
          "https://api.line.me/oauth2/v2.1/verify",
          {
            id_token: req.params.idToken,
            client_id: process.env.CLIENT_ID
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        ).catch(e => {
          console.log(e.response.data);
          throw new Error("Failed to verify IDtoken " + e.message);
        });
      const userId = (profile.data.sub);
      res.send(isResistered(userId));
    } catch(err) {
      console.log(err);
      res.send("Error");
    };
  }) ();
});

module.exports = router;

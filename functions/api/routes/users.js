const express = require("express");
const router = express.Router();
const axios = require("axios");
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const {getFirestore, Timestamp, FieldValue, Filter} = require("firebase-admin/firestore");
//const { defineString } = require("firebase-functions/params");
//const clientId = defineString("CLIENT_ID");
const serviceAccount = require("../../credential.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const validateClientId = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  if (doc.exists) {
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
      console.log(profile.data);
      const userId = (profile.data.sub);
      const isResistered = await validateClientId(userId);
      console.log({isResistered});
      if (isResistered) {
        res.send("OK")
      } else {
        res.status(404).send("the given userId was not found");
      }
    } catch(err) {
      console.log(err);
      res.send("Error");
    };
  }) ();
});

module.exports = router;

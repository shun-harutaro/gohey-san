const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const router = express.Router();

const credential = require("../../credential.json");
const serviceAccountAuth = new JWT({
  email: credential.client_email,
  key: credential.private_key,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
})

const loadShopSheetRows = async() => {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows
}

router.get("/:shopId", async (req, res) => {
  const shopId = req.params.shopId;
  try {
    const rows = await loadShopSheetRows();
    const shopInfo = rows[shopId]._rawData;
    res.send(shopInfo);
  } catch(err) {
    console.log({err});
    res.status(400).send("shopId is invalid");
  }
});

module.exports = router;

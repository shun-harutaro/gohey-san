import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

import { Button, Alert } from "@mui/material"

export const CheckIn = () => {
  const [error, setError] = useState("");
  const [liffLog, setLiffLog] = useState("");
  const [listCheckedIn, setListCheckedIn] = useState([]);

  useEffect(async() => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    const idToken = liff.getIDToken();
    await fetchCheckedInShops(idToken);
  }, []);

  const handleScan = async() => {
    const scanResult = await liff.scanCodeV2();
    const idToken = liff.getIDToken();
    const shopId = scanResult.value;
    try {
      if (isNaN(Number(shopId)) || !shopId)
        throw "不正なQRコードです";
      await checkIn(idToken, shopId);
      liff.sendMessages([
        {
          type: "text",
          text: "check in success"
        }
      ]);
      liff.closeWindow();
    } catch(err) {
      setError(err);
    }
  };

  const checkIn = async (idToken, shopId) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shops/${shopId}`);
    try {
      const res = await axios.put(url);
      setLiffLog(JSON.stringify(res.data));
      return true;
    } catch (err) {
      setError(JSON.stringify(err.response.data));
    }
  };

  const fetchCheckedInShops = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shops`);
    try {
      const res = await axios.get(url);
      const arrayCheckedInShops = res.data;
      setLiffLog(JSON.stringify(arrayCheckedInShops));
      setListCheckedIn(arrayCheckedInShops);
      return true;
    } catch (err) {
      setError("Error");
    }
  };

  return (
      <div>
        { error && <Alert severity="error">
          {error}
        </Alert> }
        { false && <p>log: {liffLog}</p> /*debug*/}
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
        >
          Scan QR Code
        </Button>
        <ul>
          { listCheckedIn && listCheckedIn.map(shop => (
            <li key={shop.id}>
              shopId: {shop.shopId}
              data: {(new Date(shop.checkedInAt._seconds * 1000)).toLocaleString()}
            </li>
            ))
          }
        </ul>
      </div>
  )
};

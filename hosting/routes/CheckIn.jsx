import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
//import { Auth } from "../auth/Auth";
const BASE_URL = process.env.REACT_APP_API_URL;

export const CheckIn = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [result, setResult] = useState('');

  const initLiff = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    if (liff.isInClient()) {
      /* いらない */
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  const handleScan = async() => {
    const result = await liff.scanCodeV2();
    const idToken = liff.getIDToken();
    const shopId = result.value;
    try {
      if (isNaN(Number(shopId)))
        throw "QRcode is invalid";
      await checkIn(idToken, shopId);
      liff.sendMessages([
        {
          type: "text",
          text: "check in success"
        }
      ]);
      liff.closeWindow();
    } catch(err) {
      setResult("check in failed");
    }
  };

  const checkIn = async (idToken, shopId) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shop/${shopId}`);
    try {
      const res = await axios.put(url);
      setResult(JSON.stringify(res.data));
      return true;
    } catch (err) {
      setResult(JSON.stringify(err.response.data));
    }
  };

  return (
      <div>
        <button onClick={handleScan}>Scan QR Code</button>
        <p>shopId: {qrCodeData}</p>
        <p>result: {result}</p>
      </div>
  )
};

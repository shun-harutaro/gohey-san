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
      const idToken = liff.getIDToken();
      await checkIn(idToken);
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  const handleScan = () => {
    liff.scanCodeV2().then((result) => {
      setQrCodeData(result.value ?? '');
    });
  };

  const checkIn = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shop/0`);
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

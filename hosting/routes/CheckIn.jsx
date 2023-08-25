import React, { useState, useEffect } from "react";
import liff from "@line/liff";
//import { Auth } from "../auth/Auth";

export const CheckIn = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  //const [result, setResult] = useState('');

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID})
  }, []);

  const handleScan = () => {
    liff.scanCodeV2().then((result) => {
      setQrCodeData(result.value ?? '');
    });
  };

  return (
      <div>
        <button onClick={handleScan}>Scan QR Code</button>
        <p>{qrCodeData}</p>
      </div>
  )
};

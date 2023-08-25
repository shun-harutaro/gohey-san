import React, { useState, useEffect } from "react";
import liff from "@line/liff";

export const CheckIn = () => {
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID_CHECKIN })
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

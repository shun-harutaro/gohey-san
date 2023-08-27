import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
//import { Auth } from "../auth/Auth";
const BASE_URL = process.env.REACT_APP_API_URL;

export const CheckIn = () => {
  const [result, setResult] = useState("");
  const [listCheckedIn, setListCheckedIn] = useState([]);

  useEffect(async() => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    const idToken = liff.getIDToken();
    await fetchCheckedInShops(idToken);
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
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shops/${shopId}`);
    try {
      const res = await axios.put(url);
      setResult(JSON.stringify(res.data));
      return true;
    } catch (err) {
      setResult(JSON.stringify(err.response.data));
    }
  };

  const fetchCheckedInShops = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shops`);
    try {
      const res = await axios.get(url);
      const arrayCheckedInShops = res.data;
      setResult(JSON.stringify(arrayCheckedInShops));
      setListCheckedIn(arrayCheckedInShops);
      return true;
    } catch (err) {
      setResult("Error");
    }
  };

  return (
      <div>
        <button onClick={handleScan}>Scan QR Code</button>
        <p>result: {result}</p>
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

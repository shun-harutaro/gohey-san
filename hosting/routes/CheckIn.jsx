import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

import { Button, Alert, Box, Stack, Paper } from "@mui/material"
//import { WidthNormal } from "@mui/icons-material";

export const CheckIn = () => {
  const [error, setError] = useState("");
  const [liffLog, setLiffLog] = useState("");
  const [listCheckedIn, setListCheckedIn] = useState([]);
  const [fetchedShopsList, setFetchedShopsList] = useState([]);

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

  const convertCheckedInShops = async (arrayShops) => {
    const arrayShopId = arrayShops.map(shop => {
      return shop.shopId
    })
    const shopsList = {};
    try {
    await Promise.all(arrayShopId.map(async shopId => {
      const url = new URL(`${BASE_URL}/api/shops/${shopId}`);
      const res = await axios.get(url);
      shopsList[shopId] = res.data;
    }));
    return shopsList;
    } catch(err) {
      setError("Error to Convert")
    }
  }

  const fetchCheckedInShops = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}/shops`);
    try {
      const res = await axios.get(url);
      const arrayCheckedInShops = res.data;
      const shopsList = await convertCheckedInShops(arrayCheckedInShops);
      setListCheckedIn(arrayCheckedInShops);
      setFetchedShopsList(shopsList);
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
        <h1>五平餅スタンプラリー</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
        >
          ここからチェックイン
        </Button>
        <Box >
        <Stack spacing={2}>
          { listCheckedIn && fetchedShopsList && listCheckedIn.map(shop => (
            <Paper sx={{ width: "80vw" }} display="flex" alignItems="center" justifyContent="center" >
              <h3>{fetchedShopsList[shop.shopId][1]}</h3>
              <p>data: {(new Date(shop.checkedInAt._seconds * 1000)).toLocaleString()}</p>
            </Paper>
            ))
          }
        </Stack>
        </Box>
      </div>
  )
};

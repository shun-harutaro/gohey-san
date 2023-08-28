import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import liff from "@line/liff";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;
import { Alert, Box, Stack, Paper } from "@mui/material"

export const Shops = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const [error, setError] = useState("");
  const [fetchedShopsList, setFetchedShopsList] = useState([]);

  const switchRegion = (region) => {
    switch(region) {
      case "toyota":
        return [0, 1, 2, 3, 4, 5];
      case "obara":
        return [6, 7, 8, 9];
      case "asahi":
        return [10, 11];
      case "inabu":
        return [12, 13, 14, 15];
      case "asuke":
        return [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
      case "shimoyama":
        return [29, 30, 31, 32, 33, 34, 35, 36, 37]
      default:
        return [];
    }
  }

  const switchShape = (shape) => {
    switch(shape) {
      case "waragi":
        return [1, 5, 6, 8, 11, 12, 13, 14, 15, 18, 19, 21, 25, 27, 28];
      case "big-waragi":
        return [29, 30, 31, 32, 33, 34, 36, 37];
      case "gohei":
        return [4, 17, 20, 23, 26]
      case "koban":
        return [0, 2]
      case "kuruma":
        return [3]
      case "hyotan":
        return [7]
      case "dango":
        return [9, 16]
      case "konoha":
        return [35]
      case "heart":
        return [9]
      case "kiritanpo":
        return [22]
      default:
        return [];
    }
  }

  const fetchShops = async (arrayShopId) => {
    const shopsList = [];
    try {
      await Promise.all(arrayShopId.map(async shopId => {
        const url = new URL(`${BASE_URL}/api/shops/${shopId}`);
        const res = await axios.get(url);
        shopsList.push(res.data);
      }));
      return shopsList;
    } catch(err) {
      setError("Error to fetch")
    }
  }

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    (async() => {
      if (query.get("region")) {
        const arrayShopId = switchRegion(query.get("region"));
        const stringArrayShopId = arrayShopId.map(id => {
          return id.toString();
        })
        const shopsList = await fetchShops(stringArrayShopId);
        setFetchedShopsList(shopsList);
      } else if (query.get("shape")) {
        const arrayShopId = switchShape(query.get("shape"));
        const stringArrayShopId = arrayShopId.map(id => {
          return id.toString();
        })
        const shopsList = await fetchShops(stringArrayShopId);
        setFetchedShopsList(shopsList);
      } else {
        setError("Error");
      }
    })();
  }, []);

  return (
    <div>
      { error && <Alert severity="error">
        {error}
      </Alert> }
      <h1>一覧</h1>
        <Box >
        <Stack spacing={2}>
          { fetchedShopsList && fetchedShopsList.map(shop => (
            <Paper sx={{ width: "80vw" }} display="flex" alignItems="center" justifyContent="center" >
              <h3>{shop[1]}</h3>
            </Paper>
            ))
          }
        </Stack>
        </Box>
    </div>
  );
};

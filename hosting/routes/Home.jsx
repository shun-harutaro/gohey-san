import React, { useState, useEffect } from "react";
import axios from "axios";
import liff from "@line/liff"
const BASE_URL = process.env.REACT_APP_API_URL;

export const Home = () => {
  const [message, setMessage] = useState("");
  const [log, setLog] = useState("");
  const initLiff = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    if (liff.isInClient()) {
      const idToken = liff.getIDToken();
      const isResistered = await validateIsResistered(idToken);
      if (isResistered) {
        setMessage("you are resistered");
      } else {
        setMessage("you are not resistered");
        await register(idToken);
      }
    }
  };

  const validateIsResistered = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}`);
    try {
      const res = await axios.get(url);
      setLog(JSON.stringify(res.data));
      return true;
    } catch (err) {
      setLog(JSON.stringify(err.response.data));
    }
  };

  const register = async (idToken) => {
    const url = new URL(`${BASE_URL}/api/users/${idToken}`);
    try {
      const res = await axios.post(url);
      setLog(JSON.stringify(res.data));
      return true;
    } catch (err) {
      setLog(JSON.stringify(err.response.data));
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  return (
    <div>
      <p>Log: {log}</p>
      <p>Message: {message}</p>
      <p>遷移中</p>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import axios from "axios";
import liff from "@line/liff";
import { Routes, Route } from "react-router-dom";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { Test } from "./routes/Test";
import { NotFound } from "./routes/NotFound";

const BASE_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [message, setMessage] = useState("");
  const [log, setLog] = useState("");
  const initLiff = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login({}); // ログインしてなければログイン
    } else if (liff.isInClient()) {
      const idToken = liff.getIDToken();
      const isResistered = await validateIsResistered(idToken);
      if (isResistered) {
        setMessage("you are resistered");
      } else {
        setMessage("you are not resistered");
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
      return false;
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  return (
    <div>
      <p>Log: {log}</p>
      <p>Message: {message}</p>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { NotFound } from "./routes/NotFound";
import liff from "@line/liff";

const App = () => {
  const [isLiff, setIsLiff] = useState(true);
  useEffect(() => {
    (async () => {
      await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
      if (!liff.isInClient()) setIsLiff(false);
    })();
  }, []);

  return (
    <div>
      {isLiff && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      {!isLiff && <h1>This app is only available on LIFF browser</h1>}
    </div>
  );
};

export default App;

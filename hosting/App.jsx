import React, { useEffect } from "react";
import liff from "@line/liff";
import { Routes, Route } from "react-router-dom";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { Test } from "./routes/Test";
import { NotFound } from "./routes/NotFound";

const App = () => {
  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
  }, []);

  return (
    <div>
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

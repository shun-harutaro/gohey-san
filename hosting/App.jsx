import React from "react";
//import liff from "@line/liff";
import { Routes, Route } from "react-router-dom";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { Test } from "./routes/Test";
import { NotFound } from "./routes/NotFound";

const App = () => {
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

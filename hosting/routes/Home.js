import React, { useState, useEffect } from "react";
import liff from "@line/liff";

export const Home = () => {
  const [profile, setProfile] = useState("");
  const [post, setPost] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getUserInfo = () => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID }).then(() => {
      setMessage("LIFF init succeeded");
      if (!liff.isLoggedIn()) {
        liff.login({}); // ログインしてなければログイン
      } else if (liff.isInClient()) {
        liff
          .getProfile()
          .then((profile) => {
            setProfile(profile);
          })
          .catch((e) => {
            setMessage("LIFF init failed.");
            setError(`${e}`);
          });
      }
    });
  };

  const sendMessages = (message) => {
    liff
      .sendMessages([
        {
          type: "text",
          text: message,
        },
      ])
      .then(() => {
        setMessage("message sent <liff.sendMessages()>");
      })
      .catch(() => {
        setMessage("Sending message failed <liff.sendMessages()>");
      });
  };

  const handleTextChange = (event) => {
    const currentVal = event.target.value;
    setPost(currentVal);
  };

  const handleSubmit = () => {
    sendMessages(post);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <h1>五平さん(Gohey-San)</h1>
      {message && <p>{message}</p>}
      <p>userID: {profile.userId}</p>
      <p>displayName: {profile.displayName}</p>
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <div>
        <h2>投稿は以下から</h2>
        <input
          type="text"
          value={post}
          label="今日は何する？"
          onChange={handleTextChange}
        />
        <input type="submit" onClick={handleSubmit} />
      </div>
    </div>
  );
};

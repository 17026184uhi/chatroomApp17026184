import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

function Chatroom() {
  useEffect(() => {
    const q = query(collection(db, "Chats"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Chatroom</h1>
      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100vh",
          flexdirection: "column"
        }}
      >
        <div
          style={{
            flex: 1,
            marginLeft: 24,
            marginright: 24,
            overflow: "auto",
            marginbottom: 24
          }}
        >
          <div
            style={{ display: "flex", flex: 1, justifyContent: "flex-start" }}
          >
            <div
              style={{
                minHeight: 52,
                width: 600,
                backgroundColor: "red",
                marginTop: 24,
                paddingLeft: 24,
                paddingRight: 24,
                borderRadius: 12
              }}
            >
              <p>Message from someone else</p>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
            <div
              style={{
                minHeight: 52,
                width: 600,
                backgroundColor: "blue",
                marginTop: 24,
                paddingLeft: 24,
                paddingRight: 24,
                borderRadius: 12
              }}
            >
              <p>Message from me</p>
            </div>
          </div>
          <input style={{ flex: 11, hight: 32, fontSize: 28 }} />
          <button
            style={{
              flex: 1,
              backgroundColor: "blue",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              borderWidth: 0
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;

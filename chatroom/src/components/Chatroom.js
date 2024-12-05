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
    </div>
  );
}

export default Chatroom;

import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

async function getChats() {
  const snapshot = await getDocs(collection(db, "Chats"));
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

function Chatroom() {
  useEffect(() => {
    getChats();
  }, []);
  return (
    <div>
      <h1>Chatroom</h1>
    </div>
  );
}

export default Chatroom;

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy
} from "firebase/firestore";

function Chatroom() {
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    setUserId(auth?.currentUser?.uid);

    const q = query(collection(db, "Chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        messages.push(doc.data());
      });
      setLocalMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100vh",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            flex: 1,
            marginLeft: 24,
            marginRight: 24,
            overflow: "auto",
            marginBottom: 24
          }}
        >
          {localMessages.map((localMessage) => (
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent:
                  userId === localMessage.uid ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  minHeight: 52,
                  width: 600,
                  backgroundColor: userId === localMessage.uid ? "blue" : "red",
                  marginTop: 24,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 12
                }}
              >
                <p>{localMessage.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 24 }}>
          <input
            style={{
              flex: 11,
              height: 32,
              fontSize: 28
            }}
            type="text"
            value={text}
            onChange={(value) => {
              setText(value.target.value);
            }}
          />
          <button
            style={{
              flex: 1,
              backgroundColor: "blue",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              borderWidth: 0
            }}
            onClick={async () => {
              const timestamp = Date.now();
              const content = text;
              const uid = userId;
              const message = { content, timestamp, uid };
              const docRef = await addDoc(collection(db, "Chats"), message);
              console.log("Document written with ID: ", docRef.id);
              if (docRef?.id) {
                setText("");
              }
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

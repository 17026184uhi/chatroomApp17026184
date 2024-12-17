import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Chatroom() {
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [localImage, setLocalImage] = useState(null);

  const storage = getStorage();

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
                {localMessage?.image && localMessage.image.length > 0 && (
                  <img
                    style={{ width: "100%", height: "auto", marginBottom: 24 }}
                    src={localMessage.image}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 24 }}>
          <form
            style={{ display: "flex", flexDirection: "row", flex: 1 }}
            onSubmit={async (e) => {
              e.preventDefault(); //prevents reload of the page
              const timestamp = Date.now();
              let image = "";
              const content = text;
              const uid = userId;
              console.log("User ID = ", uid);
              if (localImage) {
                console.log("Local image");
                const uniquelocalImage = `${
                  localImage.name
                }_${Math.random().toString(36)}`;
                const storageRef = ref(storage, `/images/${uniquelocalImage}`);
                await uploadBytes(storageRef, localImage).then(
                  async (snapshot) => {
                    console.log("uploading bytes...");
                    const firebaseUrl = await getDownloadURL(storageRef);
                    console.log("firebaseUrl", firebaseUrl);
                    const message = {
                      content,
                      timestamp,
                      uid,
                      image: firebaseUrl
                    };
                    console.log(
                      "about to add the message doc with local image to db"
                    );
                    console.log(message);
                    const docRef = await addDoc(
                      collection(db, "Chats"),
                      message
                    );
                    console.log("created docRef");
                  }
                );
              } else {
                console.log("it's a message without an image");
                const message = { content, timestamp, uid, image };
                const docRef = await addDoc(collection(db, "Chats"), message);
              }
              setText("");
              setLocalImage(null);
            }}
          >
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
            <input
              key={Date.now()}
              style={{ flex: 1 }}
              type="file"
              onChange={(e) => {
                const image = e.target.files[0];
                setLocalImage(image);
              }}
            />
            <button
              type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;

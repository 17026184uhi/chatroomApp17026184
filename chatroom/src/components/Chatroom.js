import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Chatroom() {
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [localImage, setLocalImage] = useState(null);
  const adminList = ["iCbDz7dNpoQY9VbGnj5dHv9arXM2"]; // should be current user and the creator of the message to like should not be the current usre

  const storage = getStorage();

  useEffect(() => {
    setUserId(auth?.currentUser?.uid);

    const q = query(collection(db, "Chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, "=>", doc.data());
        messages.push({ mid: doc.id, ...doc.data() }); // mid just means messageId
      });
      setLocalMessages(messages);
    });
    const isAdmin = adminList.includes(auth?.currentUser?.uid);
    console.log("Is current user in admin list?", isAdmin);
    <p>current user: isAdmin</p>;
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
                  backgroundColor:
                    userId === localMessage.uid
                      ? "blue"
                      : localMessage.like === true
                      ? "yellow"
                      : "red", // changes msg box to yellow when it's been liked
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
                {userId !== localMessage.uid &&
                  adminList.includes(userId) &&
                  localMessage.like === false && (
                    <button
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        fontSize: 22,
                        marginBottom: 24,
                        borderWidth: 0,
                        fontWeight: "bold",
                        borderRadius: 8,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingLeft: 8,
                        paddingRight: 8
                      }}
                      onClick={async () => {
                        // need the doc uid
                        const docRef = doc(db, "Chats", localMessage.mid);

                        await updateDoc(docRef, {
                          like: true
                        });
                        console.log("Set like to true!"); //works when we click like !
                      }}
                    >
                      Like
                    </button> // like button only appears for msgs from other people, non-admins, when have not been liked and when an image has been attached.
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
              const like = false;
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
                      image: firebaseUrl,
                      like
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

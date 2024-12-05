import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.js";

function Login() {
  return (
    <div style={{ display: "flex", flex: 1, height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          minWidth: 300
        }}
      >
        <button
          style={{
            backgroundColor: "red",
            borderWidth: 0,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingRight: 24,
            color: "white",
            fontSize: 18,
            fontWeight: "bold"
          }}
          onClick={async () => {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;

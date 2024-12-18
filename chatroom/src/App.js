import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Chatroom from "./components/Chatroom";
import Sorry from "./components/Sorry";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";
import { auth } from "./firebase";

function PrivateRoute({ authenticated }) {
  return authenticated === true ? (
    <Outlet />
  ) : (
    <Navigate to={{ pathname: "/" }} />
  );
}

function PublicRoute({ authenticated }) {
  return authenticated === false ? <Outlet /> : <Navigate to="chatroom" />;
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    console.log("authenticated", authenticated);
    auth.onAuthStateChanged((user) => {
      console.log(user.displayName);
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, []); //empty dependecy array, which means it only runs once

  return (
    <div>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<PublicRoute authenticated={authenticated} />}
          >
            <Route exact path="/" element={<Login />} />
          </Route>
          <Route
            exact
            path="/chatroom"
            element={<PrivateRoute authenticated={authenticated} />}
          >
            <Route exact path="/chatroom" element={<Chatroom />} />
          </Route>
          <Route exact path="/sorry" element={<Sorry />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

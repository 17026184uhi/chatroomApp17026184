import Login from "./components/Login";
import Chatroom from "./components/Chatroom";
import Sorry from "./components/Sorry";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/chatroom" element={<Chatroom />} />
          <Route exact path="/sorry" element={<Sorry />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

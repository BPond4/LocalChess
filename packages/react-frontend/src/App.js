import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./components/board";
import Login from "./components/Login";

const API_PREFIX = "http://localhost:8000"
const INVALID_TOKEN = "INVALID_TOKEN";

function App() {

  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");

  return (
    <Router>
      <div id="app">
        <Routes>
          <Route path="/" element={<Board fetchUsers={fetchUsers} />} />
          <Route path="/login" element={<Login handleSubmit={loginUser} />} />
          <Route path="/signup" element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />} />
        </Routes>
      </div>
    </Router>
  );
}

function fetchUsers() {
  const promise = fetch(`${API_PREFIX}/users`, {
    headers: addAuthHeader()
  });

  return promise;
}

function addAuthHeader(otherHeaders = {}) {
  if (token === INVALID_TOKEN) {
    return otherHeaders;
  } else {
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`
    };
  }
}

function signupUser(creds) {
  const promise = fetch(`${API_PREFIX}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(creds)
  })
    .then((response) => {
      if (response.status === 201) {
        response
          .json()
          .then((payload) => setToken(payload.token));
        setMessage(
          `Signup successful for user: ${creds.username}; auth token saved`
        );
      } else {
        setMessage(
          `Signup Error ${response.status}: ${response.data}`
        );
      }
    })
    .catch((error) => {
      setMessage(`Signup Error: ${error}`);
    });

  return promise;
}

function loginUser(creds) {
  const promise = fetch(`${API_PREFIX}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(creds)
  })
    .then((response) => {
      if (response.status === 200) {
        response
          .json()
          .then((payload) => setToken(payload.token));
        setMessage(`Login successful; auth token saved`);
      } else {
        setMessage(
          `Login Error ${response.status}: ${response.data}`
        );
      }
    })
    .catch((error) => {
      setMessage(`Login Error: ${error}`);
    });

  return promise;
}

export default App;

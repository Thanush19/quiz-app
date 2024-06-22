// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import QuestionPanel from "./components/quiz/QuestionPanel";
import TestResult from "./components/quiz/TestResult";
import Profile from "./components/Profile";
import { UserContext } from "./context/userContext";

function App() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route
        path="/profile/:id"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/test/:quizId"
        element={user ? <QuestionPanel /> : <Navigate to="/login" />}
      />
      <Route
        path="/quiz/:quizId/result"
        element={user ? <TestResult /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;

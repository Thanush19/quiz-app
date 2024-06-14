import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import QuestionPanel from "./components/quiz/QuestionPanel";
import TestResult from "./components/quiz/TestResult";
import Profile from "./components/Profile";

function App() {
  return (
    <Routes>
      <Route path="/register" element=<Register /> />
      <Route path="/login" element=<Login /> />
      <Route path="/" element=<Home /> />
      <Route path="/profile/:id" element=<Profile /> />
      <Route path="/test/:quizId" element=<QuestionPanel /> />
      <Route path="/quiz/:quizId/result" element=<TestResult /> />
    </Routes>
  );
}

export default App;

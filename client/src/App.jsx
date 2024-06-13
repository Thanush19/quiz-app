import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SellerHome from "./components/SellerHome";
import BuyerHome from "./components/BuyerHome";
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element=<Register /> />
        <Route path="/login" element=<Login /> />
        <Route path="/seller-home" element=<SellerHome /> />
        <Route path="/buyer-home" element=<BuyerHome /> />
      </Routes>
    </>
  );
}

export default App;

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import Signup from "./pages/Signup/index";
import Login from "./pages/Login/index";
import Home from "./pages/Home/index";
import ForgotPassword from "./pages/ForgotPassword/index";
import ResetPassword from "./pages/ResetPassword/index";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("jwtToken") !== null
  );

  return (
    <Grid container>
      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/account/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/account/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/account/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/account/resetPassword/:token"
          element={<ResetPassword setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Grid>
  );
}

export default App;

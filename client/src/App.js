import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import Signup from "./pages/Signup/index";
import Login from "./pages/Login/index";
import ForgotPassword from "./pages/ForgotPassword/index";
import Home from "./pages/Home/index";

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
        <Route path="/account/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Grid>
  );
}

export default App;

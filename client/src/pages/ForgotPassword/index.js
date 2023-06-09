import { useState } from "react";
import { Box, Grid, TextField, Button, Hidden, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleFormData = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setEmailError(true);
      setEmailErrorMessage("Please provide a email.");
      return;
    }

    try {
      const response = await axios.post("/account/forgotpassword", formData);
      if (response.data.status === "success") {
        setSuccessMessage(true);
        setEmailError(false);
      }
    } catch (err) {
      if (
        err.response.data.message ===
        "User does not exists. Please try another email"
      ) {
        setEmailErrorMessage(err.response.data.message);
      }
    }
  };
  return (
    <Grid
      container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={10}
        lg={9}
        sx={{
          height: "60vh",
          borderRadius: "20px",
          display: "flex",
        }}
      >
        <Hidden mdDown>
          <Grid item md={6} lg={6}>
            <Box>
              <h1>IMAGE</h1>
            </Box>
          </Grid>
        </Hidden>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          sx={{
            "@media screen and (max-width: 900px)": {
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <Grid item xs={12} sm={6} md={10} lg={10}>
            {emailError && <Alert severity="error">{emailErrorMessage}</Alert>}
            {successMessage && (
              <Alert severity="success">
                Thank you.Please check your email.
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box>
                <h2>Forgot your password?</h2>
              </Box>
              <TextField
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                error={emailError}
                onChange={handleFormData}
                variant="outlined"
                margin="normal"
                fullWidth
              />

              <Box
                sx={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Continue
                </Button>
                <span>
                  <Link to="/account/login" style={{ textDecoration: "none" }}>
                    Login
                  </Link>
                  {" / "}
                  <Link to="/account/signup" style={{ textDecoration: "none" }}>
                    Sign Up
                  </Link>
                </span>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;

import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, TextField, Button, Hidden, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const navigate = useNavigate();
  const handleFormData = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);

    try {
      const response = await axios({
        method: "post",
        url: "/account/login",
        data: formData,
      });

      const user_id = response.data.user._id;
      const user_email = response.data.user.email;
      const token = response.data.token;

      if (user_id) {
        console.log("Successfully logged!");
        setSuccessMessage(true);
        setIsLoggedIn(true);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user_email", user_email);
        localStorage.setItem("user_id", user_id);
        setErrorMessage("");
        // navigate to home page
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      if (err.name === "AxiosError") {
        setErrorMessage(err.response.data.message);
        setSuccessMessage(false);
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
          <Grid item lg={10}>
            <form onSubmit={handleSubmit}>
              <Box>
                <h2>LOGIN</h2>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && (
                  <Alert severity="success">
                    Form filled out correctly, please wait for the next steps...
                  </Alert>
                )}
              </Box>
              <TextField
                id="email"
                label="Email"
                name="email"
                type="email"
                error={emailError}
                value={formData.email}
                onChange={handleFormData}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                id="password"
                label="Password"
                name="password"
                type="password"
                error={passwordError}
                value={formData.password}
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
                  <Link to="/account/signup" style={{ textDecoration: "none" }}>
                    Sign up
                  </Link>
                  {" / "}
                  <Link
                    to="/account/forgot-password"
                    style={{ textDecoration: "none" }}
                  >
                    Forgot Password
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

export default Login;

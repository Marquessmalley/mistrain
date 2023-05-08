import { useState } from "react";
import { Grid, Hidden, Box, TextField, Alert, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const handleFormData = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `/account/resetPassword/${token}`,
        formData
      );
      if (response.data.status === "success") {
        setIsLoggedIn(true);
        setFormError(false);
        navigate("/");
      }
    } catch (err) {
      if (err) {
        setFormError(true);
        setFormErrorMessage(err.response.data.message);
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
            {formError && <Alert severity="error">{formErrorMessage}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box>
                <h2>Reset your password?</h2>
              </Box>
              <TextField
                id="password"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                // error={passwordError}
                onChange={handleFormData}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                id="passwordConfirm"
                label="Password Confirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                // error={passwordConfirmError}
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
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;

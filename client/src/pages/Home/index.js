import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem("user_email");

  const signOut = () => {
    axios
      .post("/account/signout")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return (
    <Box>
      <h2>
        Welcome{" "}
        {email ? (
          <>{email}</>
        ) : (
          <>
            <span>Guest</span>
          </>
        )}{" "}
      </h2>
      <p>This is MISTRAIN store.</p>
      <p>Project under developement...</p>
      {isLoggedIn && (
        <Button
          onClick={() => {
            setIsLoggedIn(false);
            signOut();
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_email");
            navigate("/account/login");
          }}
        >
          Log Out
        </Button>
      )}
      {isLoggedIn === false && (
        <Link to="/account/login">CLIKC HERE TO LOGIN</Link>
      )}
    </Box>
  );
};

export default Home;

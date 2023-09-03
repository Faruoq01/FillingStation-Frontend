import React, { useState } from "react";
import logo from "../../assets/comp/360logo.svg";
import Button from "@mui/material/Button";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import AuthService from "../../services/authService";
import { login } from "../../storage/auth";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (email === "")
      return swal("Warning!", "Email field cannot be empty", "info");
    if (password === "")
      return swal("Warning!", "Password field cannot be empty", "info");
    setLoader(true);

    const data = {
      email: email.toLowerCase(),
      password: password,
    };

    AuthService.login(data)
      .then((data) => {
        const auth =
          data.user.userType === "admin" ||
          data.user.userType === "superAdmin" ||
          data.user.userType === "staff";

        if (auth && data.user.status === "1") {
          dispatch(login(data));
          navigate("/home/dashboard");
        }
      })
      .then(() => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const switchToRegister = () => {
    props.reg((prev) => !prev);
  };

  return (
    <div className="login-form-container">
      <div className="inner-form-container">
        <div
          onClick={() => {
            navigate("attendant");
          }}
          className="logo-container"
          style={{ cursor: "pointer" }}>
          <img className="logo" src={logo} alt="icon" />
          <div className="writeups">
            <div className="wwttx">360-Station</div>
            <div className="ww">Digitized Fueling Managements</div>
          </div>
        </div>
        <div className="login-text">Login</div>
        <form className="main-form">
          <input
            className="input-field"
            type={"email"}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={{ marginTop: "25px" }}
            className="input-field"
            type={"password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forget-password">Forgot password</div>
          <Button
            sx={{
              width: "100%",
              height: "35px",
              background: "#076146",
              borderRadius: "24px",
              marginTop: "30px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#076146",
              },
            }}
            variant="contained"
            onClick={handleLogin}>
            Login
          </Button>
        </form>

        <div style={{ height: "35px", alignItems: "center" }} className="reg">
          <div>
            {loader && (
              <ThreeDots
                height="60"
                width="50"
                radius="9"
                color="#076146"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            )}
          </div>
          <div onClick={switchToRegister} className="register">
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

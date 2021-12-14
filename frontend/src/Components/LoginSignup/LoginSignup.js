import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignup.css";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { signupService, loginService } from "../../services/apiCalls";
import { setLocalStorage, toastFunction } from "../../services/functions";
import { isAuthenticated } from "../../auth/auth";

const LoginSignUp = ({ history, location }) => {
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  let success = false;

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  // for login user
  const loginSubmit = (e) => {
    e.preventDefault();
    setLoginLoading(true);

    loginService(loginEmail, loginPassword)
      .then((res) => {
        setLoginLoading(false);
        if (res.success) {
          setLocalStorage("data", res);
          history.push(redirect);
          return;
        }
        toastFunction({ message: res.message, type: "error" });
      })
      .catch((err) => {
        toastFunction(err.message);
        setLoginLoading(false);
      });
  };

  // for register user
  const registerSubmit = (e) => {
    setSignupLoading(true);
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    signupService(myForm)
      .then((res) => {
        setSignupLoading(false);
        if (res.success) {
          setLocalStorage("data", res);
          history.push(redirect);
          return;
        }
        toastFunction({ message: res.message, type: "error" });
      })
      .catch((err) => {
        toastFunction(err.message);
        setSignupLoading(false);
      });
  };

  // to set state values
  const registerDataChange = (e) => {
    // checking if it is user profile picture
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      // else just set user data in state
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      history.push(redirect);
    }
  }, [history, success, redirect]);

  // function to switch tabs
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
              <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          {loginLoading ? <div className="text-center">loading...</div> : ""}
          {signupLoading ? <div className="text-center">loading...</div> : ""}

          {/* Login Form */}
          <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
            <div className="loginEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to="/password/forgot">Forget Password ?</Link>
            <input type="submit" value="Login" className="loginBtn" />
          </form>
          {/* Register Form */}
          <form
            className="signUpForm"
            ref={registerTab}
            onSubmit={registerSubmit}
          >
            <div className="signUpName">
              <FaceIcon />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpPassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={registerDataChange}
              />
            </div>

            <div id="registerImage">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" />
              ) : null}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div>
            <input type="submit" value="Register" className="signUpBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginSignUp;

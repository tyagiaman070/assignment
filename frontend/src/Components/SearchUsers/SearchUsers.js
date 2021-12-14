import React, { Fragment, useState, useEffect } from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

import { isAuthenticated } from "../../auth/auth";
import { searchUserService } from "../../services/apiCalls";
import { getLocalStorage, toastFunction } from "../../services/functions";
import Profile from "../Profile/ShowProfile/Profile";
import CustomNavbar from "../Navbar/CustomNavbar";

const ForgotPassword = ({ history, location }) => {
  const localUser = isAuthenticated() && getLocalStorage("data").user;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const authenticated = isAuthenticated();

  const redirect = location.search ? location.search.split("=")[1] : "/login";

  const searchUserSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);

    searchUserService(email, getLocalStorage("data").token)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setUser(res.user);
          setEmail("");
          return;
        }
        toastFunction({ message: res.message, type: "error" });
      })
      .catch((err) => {
        toastFunction({ message: err.message, type: "error" });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!authenticated) {
      history.push(redirect);
    }
  }, [history, authenticated, redirect, user]);

  return (
    <Fragment>
      <CustomNavbar
        user={localUser}
        authenticated={isAuthenticated() ? true : false}
      />
      <div className="container">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Search User</h2>
          {loading ? <div className="text-center">loading...</div> : ""}
          <form className="forgotPasswordForm" onSubmit={searchUserSubmit}>
            <div className="forgotPasswordEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <input type="submit" value="Search" className="forgotPasswordBtn" />
          </form>
        </div>
      </div>

      {user ? (
        <Profile
          user={
            user
              ? user
              : {
                  name: "test",
                  email: "text@test.com",
                  createdAt: "01/01/1999",
                }
          }
          authenticated={isAuthenticated() ? true : false}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default ForgotPassword;

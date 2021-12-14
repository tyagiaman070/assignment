import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { isAuthenticated } from "../../auth/auth";
import { forgotPasswordService } from "../../services/apiCalls";
import { toastFunction } from "../../services/functions";

const ForgotPassword = ({ history, location }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const authenticated = isAuthenticated();

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  // to call submit email of user
  const forgotPasswordSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    forgotPasswordService(email)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          toastFunction({ message: res.message, type: "success" });
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
    if (authenticated) {
      history.push(redirect);
    }
  }, [history, authenticated, redirect]);

  return (
    <Fragment>
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password</h2>
          {loading ? <div className="text-center">loading...</div> : ""}
          <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
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

            <input type="submit" value="Send" className="forgotPasswordBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;

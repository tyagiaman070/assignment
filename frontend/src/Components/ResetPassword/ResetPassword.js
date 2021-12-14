import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { toastFunction } from "../../services/functions";
import { resetPasswordService } from "../../services/apiCalls";
import { useParams } from "react-router-dom";
import { isAuthenticated } from "../../auth/auth";

const ResetPassword = ({ history }) => {
  const params = useParams();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    setSuccess(false);
    setLoading(false);
    setError(null);
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    // call service
    resetPasswordService(myForm, params.token)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setSuccess(true);
        } else {
          setError(res.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      history.push("/account");
    }
    if (error) {
      toastFunction({
        message: error ? error : "oops something went wrong",
        type: "error",
      });
    }

    if (success) {
      toastFunction({
        message: "Password Reset success",
        type: "success",
      });
      history.push("/login");
    }
  }, [error, history, success]);

  return (
    <Fragment>
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Update Profile</h2>
          {loading ? (
            <duv className="text-center">
              <h1>Loading...</h1>
            </duv>
          ) : (
            ""
          )}
          <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
            <div>
              <LockOpenIcon />
              <input
                type="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <LockIcon />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Update" className="resetPasswordBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ResetPassword;

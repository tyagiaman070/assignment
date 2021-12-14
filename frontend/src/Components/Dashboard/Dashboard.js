import React, { useEffect, useState } from "react";
import Profile from "../Profile/ShowProfile/Profile";
import { isAuthenticated } from "../../auth/auth";
import {
  deleteAccountService,
  getMyProfileService,
  logoutService,
} from "../../services/apiCalls";
import { getLocalStorage, toastFunction } from "../../services/functions";
import CustomNavbar from "../Navbar/CustomNavbar";

const Dashboard = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // load user data from backend in initial phase
  const getUserData = () => {
    getMyProfileService(getLocalStorage("data").token)
      .then((res) => {
        setLoading(false);
        setUser(res.user);
      })
      .catch((err) => {
        toastFunction({
          message: err.message ? err.message : "Please reload the page",
          type: "error",
        });
        setLoading(false);
      });
  };

  // to logout user
  const logout = () => {
    logoutService(user._id)
      .then((res) => {
        if (res.success) {
          history.push({
            pathname: "/login",
            state: { success: true, message: "successfully logout" },
          });
        }
      })
      .catch((err) => {
        history.push({
          pathname: "/login",
          state: { success: true, message: err.message },
        });
      });
  };

  // to delete user's account
  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account")) {
      deleteAccountService(getLocalStorage("data").token)
        .then((res) => {
          if (res.success) {
            localStorage.removeItem("data");
            toastFunction({
              message: "successfully Deleted Account",
              type: "success",
            });
            history.push("/login");
          }
        })
        .catch((err) => {
          history.push({
            pathname: "/login",
            state: { success: true, message: err.message },
          });
        });
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      logoutService();
      history.push("/login");
    }
    getUserData();
  }, [history]);

  return (
    <div>
      <CustomNavbar
        user={user}
        authenticated={isAuthenticated() ? true : false}
      />
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          <Profile
            user={user}
            authenticated={isAuthenticated() ? true : false}
            type={0}
            logout={logout}
            deleteAccount={deleteAccount}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

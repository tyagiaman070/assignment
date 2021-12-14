import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import {
  getMyProfileService,
  updateProfileService,
} from "../../../services/apiCalls";
import { getLocalStorage, toastFunction } from "../../../services/functions";
import CustomNavbar from "../../Navbar/CustomNavbar";
import { isAuthenticated } from "../../../auth/auth";

const UpdateProfile = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loadingData, setLoadingData] = useState(false);

  const [loadingUpdatingData, setLoadingUpdatingData] = useState(false);
  const [error, setError] = useState(null);

  const [currentUserDetails, setCurrentUserDetails] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    setLoadingUpdatingData(true);

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    if (avatar) myForm.set("avatar", avatar);
    // call update profile service

    updateProfileService(myForm, getLocalStorage("data").token)
      .then((res) => {
        setLoadingUpdatingData(false);
        if (res.success) {
          setIsUpdated(true);
          return;
        }
        toastFunction({ message: res.message, type: "error" });
      })
      .catch((err) => {
        setLoadingUpdatingData(false);
        setError(err.message);
        setLoadingData(false);
      });
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const loadUserData = () => {
    setLoadingData(true);
    getMyProfileService(getLocalStorage("data").token)
      .then((res) => {
        setLoadingData(false);
        setCurrentUserDetails(res.user);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingData(false);
      });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (error) {
      toastFunction({
        message: error ? error : "Please reload the page",
        type: "error",
      });
    }
    if (currentUserDetails) {
      setName(currentUserDetails.name);
      setEmail(currentUserDetails.email);
      setAvatarPreview(currentUserDetails.avatar.public_url);
    }

    if (isUpdated) {
      toastFunction({ message: "Updated Successfully", type: "success" });
      history.push("/account");
      return;
    }
  }, [error, history, currentUserDetails, isUpdated]);
  return (
    <Fragment>
      <CustomNavbar
        user={currentUserDetails ? currentUserDetails : null}
        authenticated={isAuthenticated() ? true : false}
      />
      <div className="container updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>
          {loadingUpdatingData ? (
            <div className="text-center">
              <h1>Loading...</h1>
            </div>
          ) : (
            ""
          )}
          {loadingData ? (
            <div className="text-center">
              <h1>Loading...</h1>
            </div>
          ) : (
            <form className="updateProfileForm" onSubmit={updateProfileSubmit}>
              <div className="updateProfileName">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="updateProfileEmail">
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

              <div id="updateProfileImage">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" />
                ) : (
                  ""
                )}
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={updateProfileDataChange}
                />
              </div>
              <input
                type="submit"
                value="Update"
                className="updateProfileBtn"
              />
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;

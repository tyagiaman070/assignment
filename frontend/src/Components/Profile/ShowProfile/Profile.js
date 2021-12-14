import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = ({ user, authenticated, logout, type, deleteAccount }) => {
  return (
    <Fragment>
      {type === 0 ? (
        <Fragment>
          {authenticated && user !== null ? (
            <Fragment>
              <div className="profileContainer">
                <div>
                  <h1> {user.name}'s Profile</h1>
                  <img src={user.avatar.public_url} alt={user.name} />
                  <Link className="btn btn-info mt-4" to="/me/update">
                    Edit Profile
                  </Link>
                </div>
                <div>
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0, 10)}</p>
                  </div>
                  <button className="btn btn-primary mt-3" onClick={logout}>
                    Logout
                  </button>

                  <button
                    className="btn btn-danger mt-4"
                    onClick={deleteAccount}
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </Fragment>
      ) : (
        <Fragment>
          <div className="profileContainer">
            <div>
              <h1> {user.name}'s Profile</h1>
              <img src={user.avatar.public_url} alt={user.name} />
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substr(0, 10)}</p>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;

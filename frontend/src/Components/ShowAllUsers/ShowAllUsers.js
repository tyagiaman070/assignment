import React, { Fragment, useEffect, useState } from "react";
import { isAuthenticated } from "../../auth/auth";
import {
  deleteAUserService,
  getAllUsersService,
} from "../../services/apiCalls";
import { getLocalStorage, toastFunction } from "../../services/functions";
import CustomNavbar from "../Navbar/CustomNavbar";

const ShowAllUsers = () => {
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [filteredArray, setFilteredArray] = useState([]);

  const { user } = isAuthenticated();

  const handleChange = (e) => {
    setSearch(e.target.value);
    setFilteredArray(
      users.filter((user) => {
        return (
          user.email.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        );
      })
    );
  };

  const loadUsers = () => {
    setLoading(true);
    getAllUsersService(getLocalStorage("data").token)
      .then((res) => {
        setLoading(false);
        setUsers(res.users);
      })
      .catch((err) => {
        setLoading(false);
        toastFunction({
          message: "Opps Please reload the page",
          type: "error",
        });
      });
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const deleteThisUser = (user) => {
    deleteAUserService(user._id, getLocalStorage("data").token)
      .then((res) => {
        if (res.success) {
          toastFunction({
            message: `SuccessFully Deleted User  ${user.name}`,
            type: "success",
          });
          loadUsers();
        }
      })
      .catch((err) => {
        toastFunction({
          message: err.message,
          type: "error",
        });
        loadUsers();
      });
  };

  return (
    <div>
      <CustomNavbar
        user={user}
        authenticated={isAuthenticated() ? true : false}
      />
      <div style={{ width: "300px", paddingLeft: "50px" }}>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={handleChange}
        />
      </div>
      {users.length === 0 && loading ? (
        <div className="text-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <Fragment>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">SNo.</th>
                <th scope="col">Profile Picture</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Last Login</th>
                <th scope="col">Status</th>
                <th scope="col">Account Created Date</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                search === "" ? (
                  users.map((user, i) => {
                    return (
                      <tr key={user._id}>
                        <th> {i + 1} </th>
                        <th>
                          <img
                            src={user.avatar.public_url}
                            alt={user.name}
                            height={"50px"}
                            width={"50px"}
                          />
                        </th>
                        <th> {user.name} </th>
                        <th> {user.email} </th>
                        <th> {user.userLoggedInDetails.lastLogin} </th>
                        <th>
                          {JSON.stringify(
                            user.userLoggedInDetails.currentlyLoggedIn
                          )}
                        </th>
                        <th> {user.createdAt} </th>
                        <th> {user.role} </th>
                        <th>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteThisUser(user);
                            }}
                          >
                            Delete
                          </button>
                        </th>
                      </tr>
                    );
                  })
                ) : filteredArray.length === 0 ? (
                  <tr>
                    <td>No user with this name {search} </td>
                  </tr>
                ) : (
                  filteredArray.map((user, i) => {
                    return (
                      <tr key={user._id}>
                        <th> {i + 1} </th>
                        <th>
                          <img
                            src={user.avatar.public_url}
                            alt={user.name}
                            height={"50px"}
                            width={"50px"}
                          />
                        </th>
                        <th> {user.name} </th>
                        <th> {user.email} </th>
                        <th> {user.userLoggedInDetails.lastLogin} </th>
                        <th>
                          {JSON.stringify(
                            user.userLoggedInDetails.currentlyLoggedIn
                          )}
                        </th>
                        <th> {user.createdAt} </th>
                        <th> {user.role} </th>
                        <th>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteThisUser(user);
                            }}
                          >
                            Delete
                          </button>
                        </th>
                      </tr>
                    );
                  })
                )
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
};

export default ShowAllUsers;

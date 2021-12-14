import React, { Fragment } from "react";

import { Redirect, Route } from "react-router-dom";
import { isAuthenticated } from "./auth";

// to protect our routes
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { user } = isAuthenticated();

  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
          // for auth check
          if (!isAuthenticated()) {
            return <Redirect to="/login" />;
          }
          // to check if user is amdin
          if (isAdmin === true && user.role !== "admin") {
            return <Redirect to="/account" />;
          }

          return <Component {...props} />;
        }}
      />
    </Fragment>
  );
};

export default ProtectedRoute;

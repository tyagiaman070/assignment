import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  Nav,
  NavbarBrand,
  NavbarText,
} from "reactstrap";

const CustomNavbar = ({ user, authenticated }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand className="mr-auto">
          <Link to="/" className="text-dark">
            Assignment
          </Link>
        </NavbarBrand>
        <NavbarToggler
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="m-auto" navbar>
            {authenticated && user !== null && user.role === "admin" ? (
              <Link className="text-dark" to="/get-users">
                See All Users
              </Link>
            ) : (
              ""
            )}

            {authenticated && user !== null ? (
              <Fragment>
                <Link className="text-dark m-2" to="/">
                  Search Other Users
                </Link>

                <Link className="text-dark m-2" to="/account">
                  {user.name}'s Dashboard
                </Link>
              </Fragment>
            ) : (
              <Link className="text-dark m-2" to="/login">
                Login/Signup
              </Link>
            )}
          </Nav>
          {authenticated && user !== null ? (
            <NavbarText> Role: {user.role} </NavbarText>
          ) : (
            <NavbarText> loading...</NavbarText>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;

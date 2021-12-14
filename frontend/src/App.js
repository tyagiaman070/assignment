// ? Routes Stuff
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// ? alert stuff
import { ToastContainer } from "react-toastify";

// ? Components
import Dashboard from "./Components/Dashboard/Dashboard";
import LoginSignUp from "./Components/LoginSignup/LoginSignup";
import ProtectedRoute from "./auth/ProtectedRoute";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ShowAllUsers from "./Components/ShowAllUsers/ShowAllUsers";
import SearchUsers from "./Components/SearchUsers/SearchUsers";
import UpdateProfile from "./Components/Profile/UpdateProfile/UpdateProfile";
import ResetPassword from "./Components/ResetPassword/ResetPassword";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route path="/login" exact component={LoginSignUp} />

        <Route path="/password/forgot" exact component={ForgotPassword} />

        <Route path="/password/reset/:token" exact component={ResetPassword} />

        <ProtectedRoute path="/" exact component={SearchUsers} />
        <ProtectedRoute path="/account" exact component={Dashboard} />

        <ProtectedRoute
          isAdmin={true}
          path="/get-users"
          exact
          component={ShowAllUsers}
        />

        <ProtectedRoute path="/me/update" exact component={UpdateProfile} />
      </Switch>
    </Router>
  );
};

export default App;

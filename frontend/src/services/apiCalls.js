import axios from "axios";

const API = "http://localhost:5000/api/v1/";
const jsonHttpConfig = {
  headers: { "Content-Type": "application/json", Accept: "application/json" },
};

export const signupService = async (userData) => {
  try {
    const { data } = await axios.post(
      `${API}register`,
      userData,
      jsonHttpConfig
    );

    console.log("services/signupService", data);

    return data;
  } catch (err) {
    console.log("services/register/catch", err.response.data.message);
    return err.response.data;
  }
};

export const loginService = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${API}login`,
      { email, password },
      jsonHttpConfig
    );

    console.log("services/loginService", data);

    return data;
  } catch (err) {
    console.log("services/loginService/catch", err.response.data.message);
    return err.response.data;
  }
};

export const logoutService = async (email) => {
  try {
    const { data } = await axios.get(`${API}logout/${email}`, jsonHttpConfig);

    console.log("services/logoutService/catch", data);
    localStorage.removeItem("data");

    return data;
  } catch (err) {
    console.log("services/logoutService/catch", err.response.data.message);
    return err.response.data;
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const { data } = await axios.post(
      `${API}password/forgot`,
      { email },
      jsonHttpConfig
    );

    console.log("services/forgotPasswordService", data);

    return data;
  } catch (err) {
    console.log(
      "services/forgotPasswordService/catch",
      err.response.data.message
    );
    return err.response.data;
  }
};

export const getMyProfileService = async (token) => {
  try {
    const { data } = await axios.get(`${API}me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    console.log("services/getMyProfileService", data);

    return data;
  } catch (err) {
    console.log(
      "services/getMyProfileService/catch",
      err.response.data.message
    );
    return err.response.data;
  }
};

export const updateProfileService = async (userData, token) => {
  try {
    const { data } = await axios.put(`${API}me/update`, userData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    console.log("services/updateProfileService/catch", data);

    return data;
  } catch (err) {
    console.log(
      "services/updateProfileService/catch",
      err.response.data.message
    );
    return err.response.data;
  }
};

export const searchUserService = async (email, token) => {
  try {
    const { data } = await axios.get(`${API}search-user/${email}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    console.log("services/searchUserService", data);

    return data;
  } catch (err) {
    console.log("services/searchUserService/catch", err.response.data.message);
    return err.response.data;
  }
};

export const deleteAccountService = async (token) => {
  try {
    const { data } = await axios.delete(`${API}delete/me`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    console.log("services/deleteAccountService", data);

    return data;
  } catch (err) {
    console.log(
      "services/deleteAccountService/catch",
      err.response.data.message
    );
    return err.response.data;
  }
};

export const getAllUsersService = async (token) => {
  try {
    const { data } = await axios.get(`${API}admin/users`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    console.log("services/getAllUsersService", data);

    return data;
  } catch (err) {
    console.log("services/getAllUsersService/catch", err.response.data.message);
    return err.response.data;
  }
};

export const deleteAUserService = async (userId, token) => {
  try {
    const { data } = await axios.delete(`${API}admin/user/${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    console.log("services/deleteAUserService", data);

    return data;
  } catch (err) {
    console.log("services/deleteAUserService/catch", err.response.data.message);
    return err.response.data;
  }
};

export const resetPasswordService = async (passwordData, resetToken) => {
  try {
    const { data } = await axios.put(
      `${API}password/reset/${resetToken}`,
      passwordData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("services/resetPasswordService", data);

    return data;
  } catch (err) {
    console.log(
      "services/resetPasswordService/catch",
      err.response.data.message
    );
    return err.response.data;
  }
};

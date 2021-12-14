import { getLocalStorage } from "../services/functions";

// ? function to check user is authenticated or not
export const isAuthenticated = () => {
  const data = getLocalStorage("data");

  if (typeof window !== "undefined" && data !== null && data !== undefined) {
    if (Date.now() < data.expires) {
      return data;
    }
  } else {
    return false;
  }
};

import { toast } from "react-toastify";

export const setLocalStorage = (name, data) => {
  const value = JSON.stringify(data);
  localStorage.setItem(name, value);
};

export const getLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

export const toastFunction = ({
  message,
  position,
  autoClose,
  hideProgressBar,
  closeOnClick,
  pauseOnHover,
  draggable,
  progress,
  type,
}) => {
  toast(message, {
    position: position ? position : "top-right",
    type: type ? type : "default",
    autoClose: autoClose ? autoClose : 5000,
    hideProgressBar: hideProgressBar ? hideProgressBar : false,
    closeOnClick: closeOnClick ? closeOnClick : true,
    pauseOnHover: pauseOnHover ? pauseOnHover : true,
    draggable: draggable ? draggable : true,
    progress: progress ? progress : undefined,
  });
};

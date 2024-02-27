
import { ToastContainer, toast } from "react-toastify";

export const ToastConent = (type, data) => {
  return toast(data, {
    type: type ? type : "error",
      position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 2,
    theme: "colored",
  });
};

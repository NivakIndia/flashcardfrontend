import { toast } from 'react-toastify';

export const showLoaderToast = () => {
  return toast.loading("Loading...", {
    position: "top-center",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const hideLoaderToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    console.warn('Toast ID is undefined');
  }
};

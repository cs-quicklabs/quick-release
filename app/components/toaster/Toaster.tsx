import { toast } from "react-hot-toast";
import ToastAction from "../toast/ToastAction";

export const showError = (message: string) => {
  if (message) {
    toast.error(message);
  }
};

export const showSuccess = (message: string) => {
  if (message) {
    toast.success(message);
  }
};

export const showWarning = (message: string) => {
  if (message) {
    toast.loading(message, { icon: "⚠️" }); // You can customize the icon
  }
};

export const showInfo = (message: string) => {
  if (message) {
    toast.loading(message, { icon: "ℹ️" }); // You can customize the icon
  }
};

export const showAlert = (
  message: string,
  actionLabel: string,
  actionPath: string
) => {
  if (message) {
    toast(
      (t) => (
        <ToastAction
          message={message}
          actionLabel={actionLabel}
          actionPath={actionPath}
          toast={t}
        />
      ),
      { duration: 5000 } // Set your desired duration
    );
  }
};

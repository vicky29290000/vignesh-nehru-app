import { toast } from "sonner";

// Show a success toast with a default duration of 3 seconds
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000, // Customize duration as needed
  });
};

// Show an error toast with a default duration of 5 seconds
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000, // Customize duration as needed
  });
};

// Show a loading toast and return its ID to dismiss it later
export const showLoading = (message: string) => {
  return toast.loading(message, {
    duration: Infinity, // Keep it on screen until manually dismissed
  });
};

// Dismiss a toast by ID
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

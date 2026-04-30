import { Toaster } from "react-hot-toast";

export default function ToastMessage() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        error: {
          duration: 8000,
        },
      }}
    />
  );
}

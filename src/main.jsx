// This is the true entry point of the React app — it's the first file that runs.
// It wraps the whole app in AuthProvider (so login state is available everywhere)
// and BrowserRouter (so page navigation/routing works).

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* ToastContainer renders toast pop-ups anywhere in the app calls toast.success() etc. */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
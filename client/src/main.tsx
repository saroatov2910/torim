import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios, { InternalAxiosRequestConfig } from "axios";
import { Provider } from "react-redux";
import { store } from "../store";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import "rc-time-picker/assets/index.css";
import { ModalContextProvider } from "../context/Modal.context.tsx";
import { ToastContainer } from "react-toastify";
axios.defaults.baseURL = "http://localhost:8000";

function TokenInterceptor(req: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  return req;
}
axios.interceptors.request.use(TokenInterceptor);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ModalContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ModalContextProvider>
    <ToastContainer />
  </BrowserRouter>
);

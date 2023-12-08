import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import { store } from "store/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "pages/Landing";
import { ConfigProvider } from "antd";
import Login from "pages/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <Login />,
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          primaryColor: "#27fd7e",
          fontFamily: "pangea",
          fontWeight: 500,
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

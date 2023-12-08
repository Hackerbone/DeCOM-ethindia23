import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import { store } from "store/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "pages/Landing";
import { ConfigProvider } from "antd";
import Login from "pages/auth/Login";
import VendorLanding from "pages/VendorLanding";
import SpecStore from "pages/SpecStore";
import Stores from "pages/Stores";
import { LightNodeProvider } from "@waku/react";
import WakuTest from "pages/waku-test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/store",
    element: <VendorLanding />,
  },
  {
    path: "/stores/:storeAddress",
    element: <SpecStore />,
  },
  {
    path: "/stores",
    element: <Stores />,
  },
  // {
  //   path: "/waku",
  //   element: <WakuTest />,
  // },
]);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LightNodeProvider options={{ defaultBootstrap: true }}>
        <ConfigProvider
          theme={{
            primaryColor: "#27fd7e",
            fontFamily: "pangea",
            fontWeight: 500,
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </LightNodeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import { store } from "store/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "pages/Landing";
import { ConfigProvider } from "antd";
import Login from "pages/auth/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "pages/Dashboard";
import CreateStore from "pages/vendor/CreateStore";
import StoreDashboard from "pages/vendor/StoreDashboard";
import StoreProducts from "pages/vendor/StoreProducts";
import StoreOrders from "pages/vendor/StoreOrders";
import StoresList from "pages/buyer/StoresList";
import TheStore from "pages/buyer/TheStore";
import { init } from "@airstack/airstack-react";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

const anon_app_id = process.env.REACT_APP_ANON_APP_ID || "";

init(process.env.REACT_APP_AIRSTACK_API_KEY);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  // Vendor Side
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/create-store",
    element: <CreateStore />,
  },
  {
    path: "/vendor/:storeAddress",
    element: <StoreDashboard />,
  },
  {
    path: "/vendor/:storeAddress/products",
    element: <StoreProducts />,
  },
  {
    path: "/vendor/:storeAddress/orders",
    element: <StoreOrders />,
  },

  // Buyer side
  {
    path: "/stores",
    element: <StoresList />,
  },
  {
    path: "/stores/:storeAddress",
    element: <TheStore />,
  },

  // old code
  {
    path: "/stores/:storeAddress/dashboard",
    element: <Dashboard />,
  },
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
        <QueryClientProvider client={queryClient}>
          <AnonAadhaarProvider _appId={anon_app_id} _isWeb={false}> 
          <RouterProvider router={router} />
          </AnonAadhaarProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

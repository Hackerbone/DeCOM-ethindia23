import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import { store } from "store/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "pages/Landing";
import { ConfigProvider } from "antd";
import Login from "pages/auth/Login";
import SpecStore from "pages/SpecStore";
import Stores from "pages/Stores";
import Products from "pages/Products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "pages/Dashboard";
import CreateStore from "pages/vendor/CreateStore";
import StoreDashboard from "pages/vendor/StoreDashboard";
import StoreProducts from "pages/vendor/StoreProducts";

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
    path: "/store/:storeAddress",
    element: <StoreDashboard />,
  },
  {
    path: "/store/:storeAddress/products",
    element: <StoreProducts />,
  },
  // {
  //   path: "/store",
  //   element: <VendorLanding />,
  // },
  {
    path: "/stores/:storeAddress",
    element: <SpecStore />,
  },
  {
    path: "/stores/:storeAddress/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/stores/:storeAddress/products",
    element: <Products />,
  },
  {
    path: "/stores",
    element: <Stores />,
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
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

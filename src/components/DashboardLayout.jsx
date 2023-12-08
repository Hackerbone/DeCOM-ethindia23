import React, { useEffect } from "react";
import Header from "./header/Header";
import styles from "styles/components/DashboardLayout.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, hideSidebar }) => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.walletAddress) {
      navigate("/auth");
    }
  }, [user]);

  return (
    <div
      className={`${styles.dashboardLayoutContainer} ${
        hideSidebar ? styles.dashboardLayoutContainerNoSidebar : ""
      }`}
    >
      {/* {!hideSidebar && 
    <Sidebar } />} */}
      <div className={styles.dashboardLayout}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

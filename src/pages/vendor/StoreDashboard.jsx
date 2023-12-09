import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import {
  sendNotification,
  subscribeToChannel,
  readMessages,
  createChannel,
} from "services/push.service.js";
import { useSelector } from "react-redux";

const StoreDashboard = () => {
  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Dashboard</h1>
          <button className={styles.button}>Send Notification</button>
          <button className={styles.button}>Read Messages</button>
          <button className={styles.button}>Create Channel</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;

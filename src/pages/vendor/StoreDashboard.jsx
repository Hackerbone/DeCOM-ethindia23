import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import {
  sendNotification,
  subscribeToChannel,
} from "../../services/push.service";

const StoreDashboard = () => {
  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Dashboard</h1>
          <button
            className={styles.button}
            onClick={() =>
              subscribeToChannel("0xd5C4E1A40dbb6b74828A4C3E6809C8f1D1f4f5f5")
            }
          >
            Add Product
          </button>
          <button
            className={styles.button}
            onClick={() =>
              sendNotification(
                "0xd5C4E1A40dbb6b74828A4C3E6809C8f1D1f4f5f5",
                "Hello everyone"
              )
            }
          >
            Send Notification
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;

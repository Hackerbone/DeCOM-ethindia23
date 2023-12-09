import { Card, Col, Row } from "antd";
import React from "react";
import styles from "styles/components/Header.module.scss";

const NotificationsDropdown = ({ notifications }) => {


  return (
    <Card className={`${styles.profileDropdownCard} ${styles.notificationsDropdownCard}`}>
      <div className={styles.notificationsHeader}>
        Notifications
      </div>
      <Row
        align="middle"
        className={styles.notificationCard}
      >
        <Col className={styles.contents} span={20}>
        <div className={styles.notificationTitle}>Notfication 1</div>
        <div className={styles.notificationContent}>This is the content of the notification</div>
        </Col>
        <Col span={4} className={styles.times}>
          4 hours ago
        </Col>

      </Row>

     
    </Card>
  );
};

export default NotificationsDropdown;

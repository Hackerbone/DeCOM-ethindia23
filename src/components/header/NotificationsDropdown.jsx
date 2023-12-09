import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styles from "styles/components/Header.module.scss";
import { readMessages } from "services/push.service";

const NotificationsDropdown = ({ notifications }) => {
  const [allNotifications, setAllNotification] = useState([]);

  useEffect(async () => {
    const notifs = await readMessages();
    console.log(notifs);
    setAllNotification(notifs);
  }, []);

  return (
    <Card
      className={`${styles.profileDropdownCard} ${styles.notificationsDropdownCard}`}
    >
      {console.log(allNotifications)}
      <div className={styles.notificationsHeader}>Notifications</div>
      {/* get all notifcations shown here */}
      {allNotifications.map((notification) => {
        return (
          <Row align="middle" className={styles.notificationCard}>
            <Col className={styles.contents} span={20}>
              <div className={styles.notificationTitle}>
                {notification.notification.title}
              </div>
              <div className={styles.notificationContent}>
                {notification.notification.body}
              </div>
            </Col>
            <Col span={4} className={styles.times}>
              {Math.random(6).toPrecision(5)} hours ago
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

export default NotificationsDropdown;

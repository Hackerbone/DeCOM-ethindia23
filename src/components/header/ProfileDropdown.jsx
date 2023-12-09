import { Card, Row } from "antd";
import React from "react";
import styles from "styles/components/Header.module.scss";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const ProfileDropdown = ({ handleLogout, address }) => {

  const dropdownItems = [
    {
      icon: <AiOutlineLogout className={styles.icon} />,
      label: `Logout`,
      onClick: () => handleLogout(),
    },
  ];

  return (
    <Card className={styles.profileDropdownCard}>
      {address && <Row
            align="middle"
            className={styles.profileItem}
          >
            <MdOutlineAccountBalanceWallet className={styles.icon} />
            <div className={styles.profileItemNameAddress}>{address}</div>
          </Row>}
      {dropdownItems.map((item, index) => (
        <>
          <Row
            align="middle"
            className={styles.profileItem}
            onClick={item.onClick}
            key={index}
          >
            {item.icon}
            <div className={styles.profileItemName}>{item.label}</div>
          </Row>
        </>
      ))}
    </Card>
  );
};

export default ProfileDropdown;

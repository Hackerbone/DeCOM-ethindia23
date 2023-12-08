import { Card, Divider, Row } from 'antd'
import React from 'react'
import styles from "styles/components/Header.module.scss";
import { AiOutlineLogout } from 'react-icons/ai'


const ProfileDropdown = ({ handleLogout }) => {


    const dropdownItems = [
        {
            icon: <AiOutlineLogout className={styles.icon} />,
            label: `Logout`,
            onClick: () => handleLogout()
        }
    ]

    return (
        <Card className={styles.profileDropdownCard}>
            {dropdownItems.map((item, index) => (
                <>
                    <Row align="middle" className={styles.profileItem} onClick={item.onClick} key={index}>
                        {item.icon}
                        <div className={styles.profileItemName}>{item.label}</div>
                    </Row>
                </>
            ))}
        </Card>
    )
}

export default ProfileDropdown
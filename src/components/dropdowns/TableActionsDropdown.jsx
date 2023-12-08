import { Card, Row } from 'antd'
import React from 'react'
import styles from "styles/pages/Dashboard.module.scss";


const TableActionsDropdown = ({ items, record }) => {
    return (
        <Card className={`${styles.addButtonActionsCard} ${styles.tableActionsDropdownCard}`}>
            {items.map((item, index) => (
                <Row align="middle" className={styles.addItem} key={index} onClick={() => item.onClick(record)}>
                    {item.icon}
                    <div className={styles.addItemName}>{item.label}</div>
                </Row>
            ))}
        </Card>
    )
}

export default TableActionsDropdown;
import DashboardLayout from 'components/DashboardLayout'
import React from 'react'
import styles from "styles/pages/Dashboard.module.scss"


const StoreDashboard = () => {
    return (
        <DashboardLayout >
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.heading}>Dashboard</h1>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default StoreDashboard
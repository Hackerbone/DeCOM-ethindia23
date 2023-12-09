import { Card, Row } from 'antd'
import React from 'react'
import styles from "styles/components/Graph.module.scss"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    {
        month: 'Aug',
        sales: 3210,
    },
    {
        month: 'Sep',
        sales: 2989,
    },
    {
        month: 'Oct',
        sales: 4000,
    },
    {
        month: 'Nov',
        sales: 2210,

    },
    {
        month: 'Dec',
        sales: 1900,

    },
];

const StoreSessionsGraph = () => {
    return (
        <Card className={styles.graphCard}>
            <div className={styles.statDetails}>
                <div className={styles.stat}>Online store sessions</div>
                <div className={styles.statValue}>39</div>
                <Row className={styles.statRow} align="middle" justify="space-between">
                    <div className={styles.rowKey}>Visitors</div>
                    <div className={styles.rowValue}>20</div>

                </Row>
                <div className={styles.graph}>

                    <div className={styles.graphTitle}>Sales over time</div>
                    <ResponsiveContainer width={"100%"} height={200} style={{ marginLeft: "-1.6rem" }}>
                        <LineChart data={data} width={"110%"}>
                            <Line dataKey="sales" fill="#8884d8" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid vertical={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </Card>
    )
}

export default StoreSessionsGraph
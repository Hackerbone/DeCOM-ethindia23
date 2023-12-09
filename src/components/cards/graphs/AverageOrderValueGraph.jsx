import { Card } from 'antd'
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

const AverageOrderValueGraph = () => {
    return (
        <Card className={styles.graphCard}>
            <div className={styles.statDetails}>
                <div className={styles.stat}>Average order value</div>
                <div className={styles.statValue}>0.89 ETH</div>
                <div className={styles.graph}>
                    <ResponsiveContainer width={"100%"} height={200} style={{ marginLeft: "-1.6rem" }}>
                        <LineChart data={data} width={"110%"}>
                            <Line dataKey="sales" fill="#27FD7E" />
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

export default AverageOrderValueGraph
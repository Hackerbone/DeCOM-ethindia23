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

const GraphCard = () => {
    return (
        <Card className={styles.graphCard}>
            <div className={styles.statDetails}>
                <div className={styles.stat}>Total sales (Aug - Dec)</div>
                <div className={styles.statValue}>3,610 ETH</div>
                <div className={styles.graph}>

                    <div className={styles.graphTitle}>Sales over time</div>
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

export default GraphCard
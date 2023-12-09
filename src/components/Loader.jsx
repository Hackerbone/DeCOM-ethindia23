import React from 'react'
import styles from "styles/components/Common.module.scss"
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'


const Loader = () => {
  return (
    <div className={styles.loaderPageContainer}>
    <Spin indicator={<LoadingOutlined className={styles.loading} spin />} />
</div>
  )
}

export default Loader
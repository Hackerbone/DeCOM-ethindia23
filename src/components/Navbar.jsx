import { Image, Row } from 'antd'
import React from 'react'
import fulllogo from 'assets/images/logo/full-logo.svg'
import styles from 'styles/components/Navbar.module.scss'

const Navbar = () => {
    return (
        <Row align="middle" className={styles.navbarContainer}>
            <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
        </Row>
    )
}

export default Navbar
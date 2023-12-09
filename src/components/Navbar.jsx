import { Image, Row } from 'antd'
import React from 'react'
import fulllogo from 'assets/images/logo/full-logo.svg'
import styles from 'styles/components/Navbar.module.scss'

const Navbar = () => {
    return (
        <Row align="middle" className={styles.navbarContainer}>
            <a href="/">
            <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
            </a>
        </Row>
    )
}

export default Navbar
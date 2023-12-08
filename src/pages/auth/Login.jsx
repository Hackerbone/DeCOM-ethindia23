import { Button, Image } from 'antd'
import React from 'react'
import styles from 'styles/pages/Login.module.scss'
import fulllogo from 'assets/images/logo/full-logo.svg'


const Login = () => {


    const handleSafeLogin = async () => {
      console.log("login with safe")
    }


    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginPageContent}>
            <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
                <h3 className={styles.loginPageTitle}>Launch my online retail store on web3 today</h3>
                <Button onClick={handleSafeLogin} className={styles.loginButton}>Login with safe</Button>
                <div className={styles.privacyText}>By logging in, You agree to our Terms of Service and our Privacy Policy.</div>
            </div>
        </div>
    )
}

export default Login
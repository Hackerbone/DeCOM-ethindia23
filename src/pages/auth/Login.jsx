import { Button, Image } from 'antd'
import React, { useEffect } from 'react'
import styles from 'styles/pages/Login.module.scss'
import fulllogo from 'assets/images/logo/full-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import { connectWallet, initializeUser } from "store/user.slice";
import { useNavigate } from 'react-router-dom'



const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { walletAddress, isConnected, storeId } = useSelector((state) => state.user);


    useEffect(() => {
        dispatch(initializeUser());
    }, [dispatch]);


    useEffect(() => {
        if (isConnected) {
            if (!storeId) {
                navigate(`/create-store`);
            } else {
                navigate(`/store/${storeId}`);
            }
        }

    }, [walletAddress, isConnected, storeId])


    const handleSafeLogin = async () => {
        dispatch(connectWallet());
    }


    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginPageContent}>
                <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
                <h3 className={styles.loginPageTitle}>Launch my online retail store on web3 today</h3>
                <Button onClick={handleSafeLogin} disabled={isConnected} className={styles.loginButton}>{isConnected ? "Connected" : "Login with safe"}</Button>
                <div className={styles.privacyText}>By logging in, You agree to our Terms of Service and our Privacy Policy.</div>
            </div>
        </div>
    )
}

export default Login
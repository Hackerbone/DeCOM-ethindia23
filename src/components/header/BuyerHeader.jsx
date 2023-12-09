import { Dropdown, Image, Row } from 'antd'
import React from 'react'
import fulllogo from 'assets/images/logo/full-logo.svg'
import styles from 'styles/components/Navbar.module.scss'
import PrimaryButton from 'components/PrimaryButton'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineAccountCircle } from "react-icons/md"
import ProfileDropdown from './ProfileDropdown'
import { showConfirm } from 'components/modals/ConfirmModal'
import { useNavigate } from 'react-router-dom'
import { logout } from 'store/user.slice'
import {
    setIsConnected,
    setStoreId,
    setUserType,
    setWalletAddress,
  } from "store/user.slice";
  import Web3 from "web3";
import { checkVendor } from 'services/vendorfactory.service'


const BuyerHeader = () => {
    const { storeId, walletAddress } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSafeLogin = async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();
    
          const userData = await checkVendor(accounts[0]);
    
          if (!userData) {
            dispatch(setIsConnected(true));
            dispatch(setWalletAddress(accounts[0]));
            dispatch(setUserType("user"));
            navigate("/create-store");
            return;
          } else {
            // Dispatch actions to update the Redux store
            dispatch(setWalletAddress(userData.vendorWalletAddress));
            dispatch(setIsConnected(true));
            dispatch(setUserType("vendor"));
            dispatch(setStoreId(userData.vendorAddress));
          }
        } else {
          console.error("MetaMask is not installed");
        }
      };

    const handleLogout = () => {
        showConfirm({
            title: `Are you sure you want to logout?`,
            okText: `Logout`,
            onOk: async () => {
                dispatch(logout())
                navigate("/")
            },
        })
    }

    return (
        <Row align="middle" justify="space-between" className={styles.navbarContainer}>
            <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
            <div className={styles.navbarItems}>
                {!walletAddress ?
                    <PrimaryButton onClick={handleSafeLogin} className={styles.loginButton}>Login</PrimaryButton> :
                    <Dropdown trigger={["click"]} dropdownRender={() => <ProfileDropdown handleLogout={handleLogout} address={walletAddress} />}>
                        <PrimaryButton className={styles.accountButton} icon={<MdOutlineAccountCircle className={styles.accountIcon} />} />
                    </Dropdown>}
            </div>
        </Row>
    )
}

export default BuyerHeader
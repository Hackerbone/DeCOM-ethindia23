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

const BuyerHeader = () => {
    const { storeId, walletAddress } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                    <PrimaryButton className={styles.loginButton}>Login</PrimaryButton> :
                    <Dropdown trigger={["click"]} dropdownRender={() => <ProfileDropdown handleLogout={handleLogout} address={walletAddress} />}>
                        <PrimaryButton className={styles.accountButton} icon={<MdOutlineAccountCircle className={styles.accountIcon} />} />
                    </Dropdown>}
            </div>
        </Row>
    )
}

export default BuyerHeader
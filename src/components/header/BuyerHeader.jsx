import { Dropdown, Image, Row } from "antd";
import React from "react";
import fulllogo from "assets/images/logo/full-logo.svg";
import styles from "styles/components/Navbar.module.scss";
import PrimaryButton from "components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAccountCircle } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";
import { showConfirm } from "components/modals/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { logout } from "store/user.slice";
import {
  setIsConnected,
  setStoreId,
  setUserType,
  setWalletAddress,
} from "store/user.slice";
import Web3 from "web3";
import { checkVendor } from "services/vendorfactory.service";
import { RiNotification2Line } from "react-icons/ri";
import NotificationsDropdown from "./NotificationsDropdown";
import { useQuery } from "@airstack/airstack-react";
import { query } from "../../services/airstack.service";
import { subscribeToChannel } from "../../services/push.service";

const BuyerHeader = () => {
  const { walletAddress } = useSelector((state) => state.user);

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
        navigate("/stores");
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
        dispatch(logout());
        localStorage.clear();
        navigate("/");
      },
    });
  };

  const { data, loading, error } = useQuery(
    query(walletAddress),
    {},
    { cache: false }
  );

  return (
    <Row
      align="middle"
      justify="space-between"
      className={styles.navbarContainer}
    >
      <a href="/">
        <Image
          src={fulllogo}
          preview={false}
          className={styles.loginPageLogo}
        />
      </a>
      <div className={styles.navbarItems}>
        {!walletAddress ? (
          <PrimaryButton
            onClick={handleSafeLogin}
            className={styles.loginButton}
          >
            Login
          </PrimaryButton>
        ) : (
          <Row
            align="middle"
            style={{
              gap: "1rem",
            }}
          >
            <div className={styles.profileDropdownContainer}>
              <Row align="middle" className={styles.profileDropdownButton}
                onClick={async () => {
                  const subscribe_noti = await subscribeToChannel();
                }}>
                <div className={styles.userName}>
                  subscribe to notifications
                </div>
              </Row>

            </div>
            <div
              className={`${styles.profileDropdownContainer} ${styles.notificationContainer}`}
            >
              <Dropdown
                trigger={["click"]}
                dropdownRender={() => (
                  <NotificationsDropdown notifications={[]} />
                )}
              >
                <Row align="middle" className={styles.profileDropdownButton}>
                  <RiNotification2Line className={styles.downArrow} />
                </Row>
              </Dropdown>
            </div>

            {/* <button
              onClick={async () => {
                const subscribe_noti = await subscribeToChannel();
              }}
            >
              Click here to subscribe to notification
            </button> */}

            <Dropdown
            
              trigger={["click"]}
              dropdownRender={() => (
                <ProfileDropdown
                  handleLogout={handleLogout}
                  address={walletAddress}
                />
              )}
            >
              <PrimaryButton
              style={{marginLeft:"2rem"}}
                className={styles.accountButton}
                icon={<MdOutlineAccountCircle className={styles.accountIcon} />}
              >
                {" "}
                {data?.Wallet?.socials &&
                  data?.Wallet?.socials[0]?.profileName ? (
                  data?.Wallet?.socials[0]?.profileName
                ) : (
                  <>
                    {walletAddress.slice(0, 7)}...
                    {walletAddress.slice(
                      walletAddress.length - 3,
                      walletAddress.length
                    )}
                  </>
                )}
              </PrimaryButton>
            </Dropdown>
          </Row>
        )}
      </div>
    </Row>
  );
};

export default BuyerHeader;

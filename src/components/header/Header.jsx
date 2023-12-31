import React from "react";
import styles from "styles/components/Header.module.scss";
import { Col, Dropdown, Row, Tooltip } from "antd";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";
import { showConfirm } from "../modals/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/user.slice";
import { useNavigate } from "react-router-dom";
import { query } from "../../services/airstack.service";
import { useQuery } from "@airstack/airstack-react";
import { subscribeToChannel } from "../../services/push.service";
import { RiNotification2Line } from "react-icons/ri";
import NotificationsDropdown from "./NotificationsDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletAddress } = useSelector((state) => state.user);

  const handleLogout = () => {
    showConfirm({
      title: `Are you sure you want to logout?`,
      okText: `Logout`,
      onOk: async () => {
        dispatch(logout());
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
    <>
      <Row align="middle" justify="end" className={styles.headerContainer}>
        <Col className={styles.headerRight}>
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
            <div className={styles.profileDropdownContainer} style={{marginLeft:"2rem"}}>
              <Dropdown
                trigger={["click"]}
                dropdownRender={() => (
                  <ProfileDropdown handleLogout={handleLogout} />
                )}
              >
                <Tooltip title={walletAddress} placement="left">
                  <Row align="middle" className={styles.profileDropdownButton}>
                    <div className={styles.userName}>
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
                    </div>
                    <MdOutlineKeyboardArrowDown className={styles.downArrow} />

                    {/* <button
                      onClick={async () => {
                        const subscribe_noti = await subscribeToChannel();
                      }}
                    >
                      Click here to subscribe to notification
                    </button> */}
                  </Row>
                </Tooltip>
              </Dropdown>
            </div>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Header;

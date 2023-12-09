import React from "react";
import styles from "styles/components/Sidebar.module.scss";
import { Avatar, Row } from "antd";
import { MdOutlineDashboard } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import {
  PiStackSimpleBold,
  PiCirclesThreeBold,
  PiUsersBold,
  PiBuildingsBold,
  PiDatabase,
} from "react-icons/pi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkVendor } from "services/vendorfactory.service";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId, walletAddress } = useSelector((state) => state.user);
  const { isConnected } = useSelector((state) => state.user);

  const { data: vendorData } = useQuery({
    queryKey: ["get-spec-vendor-data", walletAddress],
    queryFn: async () => await checkVendor(walletAddress),
    enabled: isConnected && !!walletAddress,
  });

  const items = [
    {
      label: "",
      children: [
        {
          icon: <MdOutlineDashboard />,
          label: `Dashboard`,
          path: `/vendor/${storeId}`,
        },
      ],
    },
    {
      label: "Store",
      children: [
        {
          icon: <PiStackSimpleBold />,
          label: `Orders`,
          path: `/vendor/${storeId}/orders`,
        },
        {
          icon: <PiCirclesThreeBold />,
          label: `Products`,
          path: `/vendor/${storeId}/products`,
        },
        {
          icon: <PiBuildingsBold />,
          label: `Marketing`,
          path: `/vendor/${storeId}/marketing`,
        },
      ],
    },
    {
      label: "Brand",
      children: [
        {
          icon: <PiDatabase />,
          label: `Customise store`,
          path: `/vendor/${storeId}/branding`,
        },
      ],
    },
    {
      label: "Others",
      children: [
        {
          icon: <TbSettings />,
          label: `Settings`,
          path: `/vendor/${storeId}/settings`,
        },
        {
          icon: <TbSettings />,
          label: `Support`,
          path: `/vendor/${storeId}/support`,
        },
      ],
    },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarWrapper}>
        <div className={styles.projectSelectorContainer}>
          {/* <Dropdown trigger={["click"]} dropdownRender={() => <ProjectDropdown projects={projects} currentProject={currentProject} />}> */}
          <Row align="middle" className={styles.projectSelectorButton}>
            <Avatar
              shape="circle"
              className={styles.projectIcon}
              src={vendorData?.logo}
            ></Avatar>
            <div className={styles.projectName}>
              {vendorData?.name ?? "Store Name"}
            </div>
          </Row>
          {/* </Dropdown> */}
        </div>
        <div className={styles.sidebarItemsContainer}>
          {items.map((itemsType, index) => (
            <div
              className={styles.sidebarItemsType}
              key={`${itemsType}-${index}`}
            >
              <div className={styles.type}>{itemsType.label}</div>
              {itemsType.children.map((item, index) => (
                <Row
                  align="middle"
                  className={`${styles.sidebarItem} ${
                    location.pathname === item.path && styles.activeItem
                  }`}
                  onClick={() => handleClick(item.path)}
                  key={`${item.label}-${index}`}
                >
                  <div className={styles.sidebarItemIcon}>{item.icon}</div>
                  <div className={styles.sidebarItemLabel}>{item.label}</div>
                </Row>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

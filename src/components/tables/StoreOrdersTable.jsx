import React from "react";
import { Button, Dropdown, Row, Table } from "antd";
import { BsThreeDots } from "react-icons/bs";
import TableActionsDropdown from "components/dropdowns/TableActionsDropdown";
import styles from "styles/components/Table.module.scss";
import PrimaryButton from "components/PrimaryButton";
import { showConfirm } from "components/modals/ConfirmModal";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { decryptLighthouse, decryptUserMessage } from "services/encryptUpload";
const StoreOrdersTable = ({ ordersDropdownItems, orders }) => {
  const { walletAddress } = useSelector((state) => state.user);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Shipping Address",
      dataIndex: "encryptedData",
      key: "encryptedData",
      render: (encryptedData) => (
        <div className={styles.shippingAddressContainer}>
          <PrimaryButton
            onClick={() => {
              // decryptUserMessage(shippingAddress, walletAddress).then((res) => {
              //   console.log(res);
              //   showConfirm({
              //     title: "Shipping Address",
              //     content: res,
              //     okText: "Done",
              //     icon: <FaCheckCircle size={20} />,
              //   });
              // });
              decryptLighthouse(encryptedData).then((res) => {
                showConfirm({
                  title: "Shipping Address",
                  content: res,
                  okText: "Done",
                  icon: <FaCheckCircle size={20} />,
                });
              });
            }}
          >
            <FaLock size={16} />
            <span
              style={{
                marginLeft: "0.5rem",
              }}
            >
              View Encrypted Address
            </span>
          </PrimaryButton>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isShipped",
      key: "isShipped",
      render: (isShipped) => (isShipped ? "Shipped" : "Pending"),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "4rem",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          dropdownRender={() => (
            <TableActionsDropdown items={ordersDropdownItems} record={record} />
          )}
        >
          <div>
            <Button className={styles.actionsButtonContainer}>
              <BsThreeDots className={styles.actionsIconButton} />
            </Button>
          </div>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.resourceTableContainer}>
      <Table dataSource={orders} columns={columns} pagination={false} />
      <Row
        align="middle"
        justify="space-between"
        className={styles.tableFooter}
      >
        <div className={styles.itemsCount}>
          <span>{orders?.length}</span> Orders
        </div>
        <div className={styles.paginationButtons}>
          <PrimaryButton buttonType="pagination">Previous</PrimaryButton>
          <PrimaryButton buttonType="pagination">Next</PrimaryButton>
        </div>
      </Row>
    </div>
  );
};

export default StoreOrdersTable;

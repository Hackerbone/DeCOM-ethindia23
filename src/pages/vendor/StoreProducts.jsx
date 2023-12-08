import { Col, Row } from 'antd'
import DashboardLayout from 'components/DashboardLayout'
import PrimaryButton from 'components/PrimaryButton'
import React from 'react'
import styles from "styles/pages/Dashboard.module.scss"
import { PlusOutlined } from '@ant-design/icons'
import SearchBar from 'components/SearchBar'
import StoreProductsTable from 'components/tables/StoreProductsTable'
import {MdOutlineModeEdit } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import { showConfirm } from 'components/modals/ConfirmModal'



const StoreProducts = () => {

    const productsDropdownItems = [
        {
          label: "Edit Product",
          icon: <MdOutlineModeEdit className={styles.icon} />,
          onClick: (record) => {}
        },
        {
          label: "Delete Resource",
          icon: <BiTrash className={styles.icon} />,
          onClick: (record) => showConfirm({
            title: `Are you sure you want to delete this product?`,
            content: `This action cannot be undone.`,
            onOk: async () => {},
          }),
        },
      ]
    return (
        <DashboardLayout >
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.heading}>Products</h1>
                </div>
                <Row align="middle" justify="space-between" className={styles.actionsContainer}>
                    <Col className={styles.filterContainer}>
                        <SearchBar
                        placeholder='Search products'
                        className={styles.filterbar} />
                    </Col>
                    <Col>
                        <PrimaryButton size="small" icon={<PlusOutlined />}>Add Product</PrimaryButton>
                    </Col>
                </Row>
                <div className={styles.dashboardTableContainer} >
          <StoreProductsTable productsDropdownItems={productsDropdownItems} />
        </div>
            </div>
        </DashboardLayout>
    )
}

export default StoreProducts
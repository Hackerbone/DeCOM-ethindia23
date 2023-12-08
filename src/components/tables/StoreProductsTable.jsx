import { Avatar, Button, Dropdown, Row, Table } from 'antd'
import PrimaryButton from 'components/PrimaryButton'
import React from 'react'
import styles from 'styles/components/Table.module.scss'
import { BsThreeDots } from 'react-icons/bs'
import TableActionsDropdown from 'components/dropdowns/TableActionsDropdown'


const StoreProductsTable = ({ productsDropdownItems }) => {

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (<Row align="middle" style={{ gap: 16 }}><Avatar size={64} shape='square' />{product}</Row>)

        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'inventory',
            render: (inventory) => <><span>{inventory}</span> in stock</>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <>{price}</>

        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",

            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={productsDropdownItems} record={record} />}>
                <div>
                    <Button className={styles.actionsButtonContainer}>
                        <BsThreeDots className={styles.actionsIconButton} />
                    </Button>
                </div>
            </Dropdown>)
        },
    ];

    return (
        <div className={styles.resourceTableContainer}>
            <Table
                dataSource={[
                    {
                        product: "Adidas",
                        category: "Men's shoe",
                        inventory: 3,
                        price: "0.3666 ETH"
                    }
                ]}
                columns={columns}
                pagination={false}
            />
            <Row align="middle" justify="space-between" className={styles.tableFooter}>
                <div className={styles.itemsCount}><span>5</span>Products</div>
                <div className={styles.paginationButtons}>
                    <PrimaryButton buttonType="pagination" >Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination">Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )
}

export default StoreProductsTable
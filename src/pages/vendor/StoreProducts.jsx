import { Col, Row, message } from "antd";
import DashboardLayout from "components/DashboardLayout";
import PrimaryButton from "components/PrimaryButton";
import React, { useState } from "react";
import styles from "styles/pages/Dashboard.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import SearchBar from "components/SearchBar";
import StoreProductsTable from "components/tables/StoreProductsTable";
import { MdOutlineModeEdit } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { showConfirm } from "components/modals/ConfirmModal";
import { useQuery } from "@tanstack/react-query";
import {
  getSpecVendorProducts,
  removeProductFromVendor,
} from "services/vendor.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddProductModal from "components/modals/AddProductModal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Loader from "components/Loader";

const StoreProducts = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [addProductModal, setAddProductModal] = useState(false);

  const deleteProductMutation = useMutation({
    mutationFn: removeProductFromVendor,
    onSuccess: async (data) => {
      message.success("Product deleted successfully");
      await queryClient.invalidateQueries("allvendorproducts");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const productsDropdownItems = [
    {
      label: "Edit Product",
      icon: <MdOutlineModeEdit className={styles.icon} />,
      onClick: (record) =>
        setAddProductModal({
          ...record,
          edit: true,
        }),
    },
    {
      label: "Delete Product",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) =>
        showConfirm({
          title: `Are you sure you want to delete this product?`,
          content: `This action cannot be undone.`,
          onOk: async () => {
            await deleteProductMutation.mutateAsync({
              vendorAddress: storeAddress,
              id: record.id,
            });
          },
        }),
    },
  ];

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["allvendorproducts"],
    queryFn: () => getSpecVendorProducts(storeAddress),
    enabled: isConnected,
  });

  console.log(allProducts);

  if (isLoading) return <Loader />;

  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Products</h1>
        </div>
        <Row
          align="middle"
          justify="space-between"
          className={styles.actionsContainer}
        >
          <Col className={styles.filterContainer}>
            <SearchBar
              placeholder="Search products"
              className={styles.filterbar}
            />
          </Col>
          <Col>
            <PrimaryButton
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setAddProductModal(true)}
            >
              Add Product
            </PrimaryButton>
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <StoreProductsTable
            productsDropdownItems={productsDropdownItems}
            allProducts={allProducts?.[0]?.name ? allProducts : []}
          />
        </div>

        <AddProductModal
          visible={addProductModal}
          setVisible={setAddProductModal}
          storeAddress={storeAddress}
        />
      </div>
    </DashboardLayout>
  );
};

export default StoreProducts;

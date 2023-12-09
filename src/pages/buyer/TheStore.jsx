import { Avatar, Divider, Image, Row } from "antd";
import BuyerHeader from "components/header/BuyerHeader";
import React, { useState } from "react";
import styles from "styles/pages/Stores.module.scss";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BsGlobe2, BsThreeDots } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import SearchBar from "components/SearchBar";
import StoreItemCard from "components/cards/StoreItemCard";
import PlaceOrderModal from "components/modals/PlaceOrderModal";
import PrimaryButton from "components/PrimaryButton";
import ViewPastOrdersModal from "components/modals/ViewPastOrdersModal";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getSpecVendorProducts } from "services/vendor.service";
import Loader from "components/Loader";

import {
  checkVendor,
  getVendorByContractAddress,
} from "services/vendorfactory.service";
import ChatModal from "components/modals/ChatModal";

const TheStore = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);

  const [buyProductModal, setBuyProductModal] = useState(false);
  const [pastOrdersModal, setPastOrdersModal] = useState(false);
  const [supportChatModal, setSupportChatModal] = useState(false);

  const { data: specStoreProducts, isLoading } = useQuery({
    queryKey: ["specStoreProducts"],
    queryFn: () => getSpecVendorProducts(storeAddress),
    enabled: isConnected,
  });

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["get-spec-vendor-data", storeAddress],
    queryFn: async () => {
      const vendorWalletAddress = await getVendorByContractAddress(
        storeAddress
      );
      return await checkVendor(vendorWalletAddress);
    },
    enabled: isConnected && !!storeAddress,
  });

  const hanldePlaceOrder = (item) => {
    setBuyProductModal(item);
  };

  if (isLoading || vendorLoading) {
    return <Loader />;
  }

  return (
    <>
      <BuyerHeader />
      <div className={styles.theStoresPageContainer}>
        <div className={styles.storeHeaderContainer}>
          <Image
            src={
              "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            preview={false}
            className={styles.banner}
          />
          <div className={styles.storeDetailsContainer}>
            <Avatar
              size={120}
              src={vendorData?.logo}
              className={styles.storeLogo}
            />
            <Row
              align="middle"
              justify="space-between"
              className={styles.storeDetails}
            >
              <div className={styles.storeName}>
                {vendorData?.name}{" "}
                <VscVerifiedFilled className={styles.verifyIcon} />
              </div>
              <Row className={styles.storeSocials}>
                <BsGlobe2 className={styles.social} />
                <FaTwitter className={styles.social} />
                <BsThreeDots className={styles.social} />
              </Row>
            </Row>
            <div className={styles.storeDescription}>
              <div className={styles.content}>
                Adidas, a leading sportswear manufacturer, is renowned for its
                high-quality athletic shoes, apparel, and accessories. Founded
                in Germany, it has a rich history in sports...
              </div>{" "}
              {"  "}See more
            </div>
            <Row align="middle" className={styles.storeSpecs}>
              <div className={styles.storeSpec}>
                Store items <span>{specStoreProducts?.length}</span>
              </div>
              <div className={styles.specSeparator} />
              <div className={styles.storeSpec}>
                Chain <span>Ethereum</span>
              </div>
            </Row>
          </div>
        </div>
        <div className={styles.pageContent}>
          <Divider className={styles.divider} />
          <Row
            align="middle"
            justify="space-between"
            className={styles.searchRow}
          >
            <Row align="middle" style={{ gap: 10 }}>
              <SearchBar className={styles.bar} />
              <div className={styles.results}>
                {specStoreProducts?.length} results
              </div>
            </Row>
            <Row style={{ gap: 10 }}>
              <PrimaryButton
                onClick={() => setPastOrdersModal(true)}
                className={styles.pastOrdersButton}
              >
                View past orders
              </PrimaryButton>
            </Row>
          </Row>
          <div className={styles.itemsList}>
            {specStoreProducts?.map((item, idx) => {
              return (
                <StoreItemCard
                  key={idx}
                  item={item}
                  hanldePlaceOrder={hanldePlaceOrder}
                />
              );
            })}
          </div>
        </div>

        <ChatModal
          visible={supportChatModal}
          setVisible={setSupportChatModal}
          title="Chat with your customer"
          userId={vendorData?.vendorWalletAddress}
        />

        <PlaceOrderModal
          visible={buyProductModal}
          setVisible={setBuyProductModal}
          storeAddress={storeAddress}
          wantsKYC={vendorData?.wantsKYC}
        />

        <ViewPastOrdersModal
          visible={pastOrdersModal}
          setVisible={setPastOrdersModal}
          setSupportChatModal={setSupportChatModal}
          storeAddress={storeAddress}
        />
      </div>
    </>
  );
};

export default TheStore;

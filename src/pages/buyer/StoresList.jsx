import Navbar from "components/Navbar";
import SearchBar from "components/SearchBar";
import StoreListingCard from "components/cards/StoreListingCard";
import React from "react";
import styles from "styles/pages/Stores.module.scss";
import { useQuery } from "@tanstack/react-query";
import { listAllVendors } from "services/vendor.service";
import { useDispatch } from "react-redux";
import { setCurrentStore } from "store/user.slice";
import { useNavigate } from "react-router-dom";

const StoresList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: listAllVendors,
  });

  const handleSelectStore = (item) => {
    dispatch(
      setCurrentStore({
        storeId: item.vendorAddress,
        name: item.name,
        logo: item.logo,
      })
    );
    navigate(`/stores/${item.vendorAddress}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.storesListContainer}>
        <div className={styles.storesListContainerHeader}>
          <h1>
            Discover <span>decom</span> stores
          </h1>
          <SearchBar
            className={styles.searchbar}
            placeholder="Search for stores"
            allowClear
          />
          <div className={styles.storesCount}>{vendors?.length} stores</div>
        </div>
        <div className={styles.storesList}>
          {vendors?.map((item, idx) => (
            <StoreListingCard
              key={idx}
              item={item}
              handleSelectStore={handleSelectStore}
            />
          ))}
        </div>
        <div className={styles.endOfStores}>You've reached the end</div>
      </div>
    </>
  );
};

export default StoresList;

import SearchBar from "components/SearchBar";
import StoreListingCard from "components/cards/StoreListingCard";
import React from "react";
import styles from "styles/pages/Stores.module.scss";
import { useQuery } from "@tanstack/react-query";
import { listAllVendors } from 'services/vendor.service'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentStore } from 'store/user.slice'
import { useNavigate } from 'react-router-dom'
import BuyerHeader from 'components/header/BuyerHeader'

const StoresList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isConnected } = useSelector((state) => state.user);


    const { data: vendors, isLoading } = useQuery({
        queryKey: ["vendors"],
        queryFn: listAllVendors,
        enabled: isConnected,
    });

    const handleSelectStore =(item) => {
        dispatch(
            setCurrentStore({
              storeId: item.vendorAddress,
              name: item.name,
              logo: item.logo,
            })
          );
          navigate(`/stores/${item.vendorAddress}`);
    }



    return (
        <>
            <BuyerHeader  />
            <div className={styles.storesListContainer}>
                <div className={styles.storesListContainerHeader}>
                    <h1>Discover <span>decom</span> stores</h1>
                    <SearchBar className={styles.searchbar} placeholder='Search for stores' allowClear />
                    <div className={styles.storesCount}>{vendors?.length} stores</div>
                </div>
                <div className={styles.storesList}>
                    {vendors?.map((item, idx) => (
                        <StoreListingCard key={idx} item={item} handleSelectStore={handleSelectStore} />
                    ))}
                </div>
                <div className={styles.endOfStores}>{isConnected ? "You've reached the end" : "Sign in to view stores"}</div>
            </div>
        </>
    )
}

export default StoresList

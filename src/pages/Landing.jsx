import { Image, Input, Row, message } from "antd";
import Navbar from "components/Navbar";
import React from "react";
import styles from "styles/pages/Landing.module.scss";
import { getNftWall2023 } from "services/airstack.service";
import PrimaryButton from "components/PrimaryButton";


export default function LandingPage() {
  const [nftWall2023, setNftWall2023] = React.useState(null);
  const inputRef = React.useRef(null);
  const [loading,setLoading] = React.useState(null);


  const getNftWall = async () => {
    setLoading(true);
    const owner_address = inputRef.current?.input.value;

    if (!owner_address) {
      message.error("Please enter a valid address")
    }

   const result = await getNftWall2023(owner_address);
   setNftWall2023(result?.url);
   setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <div className={styles.homeContent}>
          <h1 className={styles.heroHeading}>Craft Your <span>Commerce</span> with Web3</h1>
          <p>Revolutionize online retail with our Web3 builder</p>
          <Row align="middle" className={styles.ctas}>
            <a href="/auth">I'm a vendor</a>
            <a href="/stores">I'm a customer</a>
          </Row>

          {nftWall2023 ? <div className={styles.airstackWrap}>
            <Image src={nftWall2023} className={styles.airstackWrapImage} />
          </div> : null}
          <div className={styles.airstackWrapContent}>
            <h2>Build your own NFT wall</h2>
            <Input ref={inputRef} type="text" placeholder="Enter your wallet address or ENS" className={styles.airstackInput} />
            <PrimaryButton onClick={getNftWall} className={styles.createWallButton} loading={loading}>Create my NFT wall</PrimaryButton>
          </div>
        </div>
      </div>
    </>

  );
}

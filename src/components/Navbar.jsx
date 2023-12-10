import { Image, Row, Select } from 'antd'
import React, { useEffect } from 'react'
import fulllogo from 'assets/images/logo/full-logo.svg'
import styles from 'styles/components/Navbar.module.scss'
import { useDispatch } from 'react-redux'
import { setNetwork } from 'store/user.slice'

const networkOptions = [
    {
        "name": "Scroll Sepolia",
        "address": "0xc25cbb5c8ec033fde604de95aec57a08e7318b31"
    },
    {
        "name": "Polygon zkEVM",
        "address": "0x4017d6895d3cd05b1cbc8464a21956f2da8c9fdc"
    },
    {
        "name": "Arbitrum Goerli",
        "address": "0xe9ea7a6a1fe9b4b2849b57720be3b06813bb7ed6"
    },
    {
        "name": "Mantle",
        "address": "0x28e699733e55f0700174b79dee214a4a1b76ad1f"
    },
    {
        "name": "Celo Alfajores",
        "address": "0x15fa09ab7b889069eb86c20d23fd389c6dbeebd4"
    },
    {
        "name": "Base Goerli",
        "address": "0x7ca5fa6f8871e9495ecefef012a0bffecbb5e928"
    },
    {
        "name": "OKX X1",
        "address": "0x7ca5fa6f8871e9495ecefef012a0bffecbb5e928"
    }
]

const Navbar = () => {
    const dispatch = useDispatch();

    const network = localStorage.getItem("network");

    const handleNetworkChange = (value) => {
        dispatch(setNetwork(value));
        localStorage.setItem("network", value);
    }

    useEffect(() => {
        const network = localStorage.getItem("network");
        if (network) {
            dispatch(setNetwork(network));
        } else {
            localStorage.setItem("network", networkOptions[0].address);
            dispatch(setNetwork(network));
        }
    }, [])


    return (
        <Row align="middle" justify="space-between" className={styles.navbarContainer}>
            <a href="/">
                <Image src={fulllogo} preview={false} className={styles.loginPageLogo} />
            </a>

            <Select defaultValue={network ?? networkOptions[0].address} placeholder="select network" className={styles.formSelect} style={{ width: "10rem", height: "2.5rem" }} onSelect={handleNetworkChange}>
                {networkOptions.map((option, index) => (
                    <Select.Option key={index} value={option.address}>{option.name}</Select.Option>
                ))}
            </Select>
        </Row>
    )
}

export default Navbar
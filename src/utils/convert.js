import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1a2f1d6b0e5e4b0b8d0b2f8a2d8c4a6e"
  )
); // Initialize web3 with your Ethereum provider

export const convertToEthers = (amount) => {
  return web3.utils.fromWei(amount.toString(), "ether");
};

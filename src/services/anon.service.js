import { ethers } from "ethers";
import vendorContract from "abis/Vendor.json";

export const setAadharVerfied = async ({ walletAddress, vendorAddress }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );

  await contract.setAadharVerified(walletAddress);
};

export const getAadharStatus = async ({ walletAddress, vendorAddress }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );

  await contract.getAadharVerified(walletAddress);
};

import { ethers } from "ethers";
import vendorFactoryContract from "abis/VendorFactory.json";
import vendorContract from "abis/Vendor.json";

export const listAllVendors = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_GLOBAL_CONTRACT_ADDRESS,
    vendorFactoryContract.abi,
    signer
  );
  const vendors = await contract.listVendors();
  return vendors;
};

export const createVendorContract = async (vendorDetails) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_GLOBAL_CONTRACT_ADDRESS,
    vendorFactoryContract.abi,
    signer
  );
  const tx = await contract.createVendorContract(
    vendorDetails.name,
    vendorDetails.logo
  );
  const receipt = await tx.wait();
  const event = receipt.events.find((event) => event.event === "VendorCreated");
  const newVendorAddress = event.args.vendorAddress;
  return newVendorAddress;
};

export const isVendor = async (walletAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    process.env.REACT_APP_GLOBAL_CONTRACT_ADDRESS,
    vendorFactoryContract.abi,
    provider
  );
  const isVendor = await contract.isVendor(walletAddress);
  return isVendor;
};

export const checkVendor = async (walletAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      process.env.REACT_APP_GLOBAL_CONTRACT_ADDRESS,
      vendorFactoryContract.abi,
      provider
    );
    const vendorData = await contract.getVendorByWalletAddress(walletAddress);
    return vendorData;
  } catch (error) {
    console.error("Error in checkVendor:", error.data);
    if (error.data) {
      console.error("Error data:", error.data.message);
    }
    return null;
  }
};

export const getVendorByContractAddress = async (vendorAddress) => {
  try {
    // owner is a public variable in the vendor contract, get that for Vendor contract at vendorAddress
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      vendorAddress,
      vendorContract.abi,
      provider
    );
    const vendorData = await contract.owner();
    return vendorData;
  } catch (error) {
    console.error("Error in checkVendor:", error.data);
    if (error.data) {
      console.error("Error data:", error.data.message);
    }
  }
};

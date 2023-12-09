import { ethers } from "ethers";
import vendorFactoryContract from "abis/VendorFactory.json";
import vendorContract from "abis/Vendor.json";
import { getContractAddress } from "utils/util";

export const listAllVendors = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const mainContractAddress = getContractAddress(network.name);

  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    mainContractAddress,
    vendorFactoryContract.abi,
    signer
  );
  const vendors = await contract.listVendors();
  return vendors;
};

export const createVendorContract = async (vendorDetails) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const mainContractAddress = getContractAddress(network.name);

  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    mainContractAddress,
    vendorFactoryContract.abi,
    signer
  );
  const tx = await contract.createVendorContract(
    vendorDetails.name,
    vendorDetails.logo,
    vendorDetails.wantsKYC
  );
  console.log("tx", tx);
  const receipt = await tx.wait();
  console.log("receipt", receipt);
  const event = receipt.events.find((event) => event.event === "VendorCreated");
  console.log("event", event);
  const newVendorAddress = event.args.vendorAddress;
  console.log("newVendorAddress", newVendorAddress);
  return newVendorAddress;
};

export const checkVendor = async (walletAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const mainContractAddress = getContractAddress(network.name);

    const contract = new ethers.Contract(
      mainContractAddress,
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
    const network = await provider.getNetwork();
    const mainContractAddress = getContractAddress(network.name);

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

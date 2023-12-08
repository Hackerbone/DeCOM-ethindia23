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
  console.log(vendors);

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
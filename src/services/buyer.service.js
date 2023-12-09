import { ethers } from "ethers";
import vendorFactoryContract from "abis/VendorFactory.json";
import vendorContract from "abis/Vendor.json";

export const markOrderAsReceived = async (vendorAddress, orderId) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.markAsReceived(orderId);
  return await tx.wait();
};

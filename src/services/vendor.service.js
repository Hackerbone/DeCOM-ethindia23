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

export const getSpecVendorProducts = async (vendorAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const vendorData = await contract.getProductList();

  const processedResponse = vendorData.map((product) => ({
    id: product.id.toNumber(), // Convert BigNumber to number
    name: product.name,
    picture: product.picture,
    price: product.price, // Keep as string if this is a Wei value
    isAvailable: product.isAvailable,
  }));

  return processedResponse;
};

export const addProductToVendor = async (
  vendorAddress,
  { name, picture, price }
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.addProduct(name, picture, price);
  await tx.wait();
};

export const removeProductFromVendor = async (vendorAddress, { id }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.removeProduct(id);
  await tx.wait();
};

export const placeOrder = async (vendorAddress, { id, shippingAddress }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.placeOrder(id, shippingAddress);
  await tx.wait();
};

export const trackOrderOfVendor = async (vendorAddress, { order_id }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.trackOrder(order_id);
  await tx.wait();
};

export const withdrawFunds = async (vendorAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.withdrawFunds();
  await tx.wait();
};
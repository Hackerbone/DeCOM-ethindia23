import { ethers } from "ethers";
import vendorFactoryContract from "abis/VendorFactory.json";
import vendorContract from "abis/Vendor.json";
import axios from "axios";
import {
  subscribeToChannel,
  callTriggerNotification,
  readMessages,
} from "./push.service";

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

  // const data = await readMessages();
  // console.log(data);

  return processedResponse;
};

export const addProductToVendor = async ({
  vendorAddress,
  name,
  picture,
  price,
}) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.addProduct(name, picture, price);
  const receipt = await tx.wait();
  const event = receipt.events.find((event) => event.event === "ProductAdded");
  const newProductId = event.args.id;
  return newProductId;
};

export const removeProductFromVendor = async ({ vendorAddress, id }) => {
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

export const placeOrder = async ({
  vendorAddress,
  id,
  shippingAddress,
  vendorShippingAddress,
  productPrice,
}) => {
  // call subscribeToChannel from push.service.js

  const subscribe_noti = await subscribeToChannel();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );

  console.log("Ready to place order");

  const tx = await contract.placeOrder(
    id,
    shippingAddress,
    vendorShippingAddress,
    {
      from: signer.getAddress(),
      value: productPrice,
    }
  );
  // const receipt = await tx.wait();
  // const event = receipt.events.find((event) => event.event === "OrderPlaced");
  // const orderId = event.args.id;
  await tx.wait();

  const address_id = await signer.getAddress();

  console.log("address_id", address_id);

  const send_noti = await axios.post(
    "http://localhost:8080/api/push/trigger-notification",
    {
      subscribers: [address_id],
      title: "New Order",
      notibody: "You have placed new order",
    }
  );

  // return orderId;
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

export const getOrdersOfVendor = async (vendorAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );

  const address = await signer.getAddress();
  const orders = await contract.getOrders({
    from: address,
  });

  const processedResponse = orders.map((order) => ({
    id: order.id.toNumber(), // Convert BigNumber to number
    productId: order.productId.toNumber(),
    customer: order.customer,
    shippingAddress: order.vendorShippingAddress,
    isShipped: order.isShipped,
  }));

  return processedResponse;
};

export const getOrdersByCustomer = async (customerAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    customerAddress,
    vendorContract.abi,
    signer
  );

  const address = await signer.getAddress();
  const orders = await contract.getOrdersByCustomer(address);

  const processedResponse = orders.map((order) => ({
    id: order.id.toNumber(), // Convert BigNumber to number
    productId: order.productId.toNumber(),
    customer: order.customer,
    shippingAddress: order.shippingAddress,
    isShipped: order.isShipped,
  }));

  return processedResponse;
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

export const markOrderAsShipped = async ({ vendorAddress, order_id }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    vendorAddress,
    vendorContract.abi,
    signer
  );
  const tx = await contract.updateOrderToShipped(order_id);
  await tx.wait();
};

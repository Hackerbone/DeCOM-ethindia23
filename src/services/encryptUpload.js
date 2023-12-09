import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import Web3 from "web3";
// import ipfsClient from "ipfs-http-client"; // or your preferred IPFS client
import { encrypt as metamaskEncrypt } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import contract from "abis/Vendor.json";
import EthCrypto from "eth-crypto";

// Function to encrypt data with a symmetric key (AES)
const encryptData = async (dataBuffer, key, iv) => {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(dataBuffer, keyUtf8, { iv: ivUtf8 });
  return encrypted.toString();
};

// Function to get the signer's Ethereum account
const getSigner = async () => {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  return accounts[0]; // The first account is usually the signer
};

// Updated encryptKeyWithPublicKey function to use Metamask encryption
const encryptKeyWithPublicKey = async (publicKeyB64, keyObjBuffer) => {
  const encryptedKey = metamaskEncrypt({
    publicKey: publicKeyB64,
    data: bufferToHex(keyObjBuffer), // convert buffer to hex string
    version: "x25519-xsalsa20-poly1305",
  });

  return Buffer.concat([
    Buffer.from(encryptedKey.ephemPublicKey, "base64"),
    Buffer.from(encryptedKey.nonce, "base64"),
    Buffer.from(encryptedKey.ciphertext, "base64"),
  ]);
};

// export const handleShippingDetailsUpload = async (
//   shippingDetails,
//   userWalletAddress,
//   vendorWalletAddress
// ) => {
//   try {
//     // Convert shipping details to a format suitable for encryption (e.g., JSON)
//     const shippingDetailsString = shippingDetails.toString();
//     const shippingDetailsBuffer = Buffer.from(shippingDetailsString);

//     // Generate encryption key and IV for symmetric encryption
//     const key = CryptoJS.lib.WordArray.random(256 / 8);
//     const iv = CryptoJS.lib.WordArray.random(128 / 8);

//     // Encrypt the shipping details with symmetric key
//     const encryptedDetails = await encryptData(shippingDetailsBuffer, key, iv);
//     const encryptedDetailsFile = new File(
//       [encryptedDetails],
//       "encrypted_shipping_details"
//     );

//     // Encrypt the symmetric key for both the user and the vendor
//     let userPublicKeyB64 = await window.ethereum.request({
//       method: "eth_getEncryptionPublicKey",
//       params: [userWalletAddress],
//     });
//     let vendorPublicKeyB64 = await window.ethereum.request({
//       method: "eth_getEncryptionPublicKey",
//       params: [vendorWalletAddress],
//     });
//     const encryptedKeyForUser = await encryptKeyWithPublicKey(userPublicKeyB64);
//     const encryptedKeyForVendor = await encryptKeyWithPublicKey(
//       vendorPublicKeyB64
//     );

//     // Upload encrypted shipping details and keys to IPFS
//     const encryptedDetailsAdded = await ipfsClient.add(encryptedDetailsFile);
//     const encryptedKeyForUserAdded = await ipfsClient.add(encryptedKeyForUser);
//     const encryptedKeyForVendorAdded = await ipfsClient.add(
//       encryptedKeyForVendor
//     );

//     const signer = await getSigner();

//     // Update the contract with the IPFS hash of the encrypted shipping details and keys
//     const contractInstance = new ethers.Contract(
//       localStorage.getItem("contractAddress") || "",
//       contract.abi,
//       signer
//     );
//     const tx = await contractInstance.addShippingDetails(
//       encryptedDetailsAdded.path,
//       encryptedKeyForUserAdded.path,
//       encryptedKeyForVendorAdded.path
//     );
//     return tx;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const handleShippingDetailsEncrypt = async ({
  shippingDetails,
  userWalletAddress,
  vendorWalletAddress,
}) => {
  try {
    // Convert shipping details to a string
    const shippingDetailsString = JSON.stringify(shippingDetails);

    // Get the public keys for the user and the vendor
    // let userPublicKeyB64 = await window.ethereum.request({
    //   method: "eth_getEncryptionPublicKey",
    //   params: [userWalletAddress],
    // });
    // let vendorPublicKeyB64 = await window.ethereum.request({
    //   method: "eth_getEncryptionPublicKey",
    //   params: [vendorWalletAddress],
    // });

    // let userPublicKeyB64 = Buffer.from(userWalletAddress, "hex").toString(
    //   "base64"
    // );
    // let vendorPublicKeyB64 = Buffer.from(vendorWalletAddress, "hex").toString(
    //   "base64"
    // );

    // let userPublicKeyB64 = btoa(userWalletAddress);
    // let vendorPublicKeyB64 = btoa(vendorWalletAddress);
    // Get the public keys for the user and the vendor
    let userPublicKeyB64 = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [userWalletAddress],
    });
    let vendorPublicKeyB64 = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [vendorWalletAddress],
    });

    const upublicKeyUint8Array = Uint8Array.from(
      Buffer.from(userWalletAddress, "base64")
    );

    console.log("userPublicKeyB64", userPublicKeyB64);

    console.log("Public Key Length:", upublicKeyUint8Array.length);

    const vpublicKeyUint8Array = Uint8Array.from(
      Buffer.from(vendorWalletAddress, "base64")
    );

    console.log("Public Key Length:", vpublicKeyUint8Array.length);

    console.log("vendorPublicKeyB64", vendorPublicKeyB64);
    // Encrypt the shipping details with the public keys
    const encryptedUserShipping = await encryptWithPublicKey(
      userPublicKeyB64,
      shippingDetailsString
    );

    console.log("encryptedUserShipping", encryptedUserShipping);

    const encryptedVendorShipping = await encryptWithPublicKey(
      vendorPublicKeyB64,
      shippingDetailsString
    );

    console.log("encryptedVendorShipping", encryptedVendorShipping);

    return {
      encryptedUserShipping,
      encryptedVendorShipping,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function encryptWithPublicKey(publicKeyB64, data) {
  // Convert the Base64 public key to an Uint8Array
  const publicKeyUint8Array = Uint8Array.from(
    Buffer.from(publicKeyB64, "base64")
  );

  // Ensure the public key is of the correct length
  if (publicKeyUint8Array.length !== 33 && publicKeyUint8Array.length !== 65) {
    throw new Error("Invalid public key length");
  }

  // Encrypt the data
  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKeyUint8Array, // publicKey
    data // message
  );

  // Return the encrypted data as a string
  return EthCrypto.cipher.stringify(encrypted);
}

// // Helper functions like encryptData, getSigner, etc., need to be defined or imported.

// // Example
// const shippingDetails = {
//   name: "John Doe",
//   address: "123 Main St, Anytown, AN 12345",
// };

// handleShippingDetailsUpload(
//   shippingDetails,
//   "userWalletAddress",
//   "vendorWalletAddress"
// )
//   .then((tx) => console.log("Transaction successful:", tx))
//   .catch((error) => console.error("Error in transaction:", error));

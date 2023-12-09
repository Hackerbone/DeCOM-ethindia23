import { encrypt } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

export const handleShippingDetailsEncrypt = async ({
  shippingDetails,
  userWalletAddress,
  vendorWalletAddress,
}) => {
  try {
    // Convert shipping details to a string
    const shippingDetailsString = JSON.stringify(shippingDetails);

    let userPublicKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [userWalletAddress],
    });
    console.log("User Public Key:", userPublicKey);

    let vendorPublicKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [vendorWalletAddress],
    });
    console.log("Vendor Public Key:", vendorPublicKey);

    // Encrypt the shipping details with the public keys
    const encryptedUserShipping = encryptWithPublicKey(
      userPublicKey,
      shippingDetailsString
    );
    const encryptedVendorShipping = encryptWithPublicKey(
      vendorPublicKey,
      shippingDetailsString
    );

    return {
      encryptedUserShipping,
      encryptedVendorShipping,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

function encryptWithPublicKey(publicKey, data) {
  console.log("Data to be encrypted:", data); // Add this line

  if (!publicKey || typeof publicKey !== "string") {
    throw new Error("Invalid or missing public key");
  }
  if (!data) {
    throw new Error("Invalid or missing data");
  }

  const encryptedMessage = encrypt({
    publicKey,
    data: bufferToHex(Buffer.from(data, "utf8")),
    version: "x25519-xsalsa20-poly1305",
  });

  return JSON.stringify(encryptedMessage);
}

export async function decryptUserMessage(encryptedData, walletAddress) {
  try {
    // Ensure the encrypted data is in string format
    const encryptedDataString = encryptedData;
    console.log("Encrypted Data String:", encryptedDataString);

    const ct = `0x${Buffer.from(encryptedDataString, "utf8").toString("hex")}`;
    // Request decryption
    const decryptedHex = await window.ethereum.request({
      method: "eth_decrypt",
      params: [ct, walletAddress],
    });

    // Convert hex to readable string
    const decryptedMessage = Buffer.from(
      decryptedHex.substring(2),
      "hex"
    ).toString("utf8");

    return decryptedMessage;
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw error;
  }
}

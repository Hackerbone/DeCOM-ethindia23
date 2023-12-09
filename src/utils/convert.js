import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1a2f1d6b0e5e4b0b8d0b2f8a2d8c4a6e"
  )
); // Initialize web3 with your Ethereum provider

export const convertToEthers = (amount) => {
  return web3.utils.fromWei(amount.toString(), "ether");
};

export const convertToWei = (amountInEther) => {
  return web3.utils.toWei(amountInEther, "ether");
};

export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export async function blobToBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export const downloadFile = (cid, filename) => {
  fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
    .then((response) => {
      if (response.ok) return response.arrayBuffer(); // Use arrayBuffer for binary data
      throw new Error("Network response was not ok.");
    })
    .then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], { type: "application/pdf" });

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename; // Set the filename
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error("Failed to download the file:", error);
    });
};

// Example usage

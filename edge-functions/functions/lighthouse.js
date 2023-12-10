import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";
import express from "express";

const router = express.Router();

router.post("/upload-text", async (req, res) => {
  try {
    const {
      shippingAddress,
      userPublicKey,
      userSign,
      vendorPublicKey,
      vendorSign,
    } = req.body;
    console.log(req.body);
    const apiKey = process.env.LIGHTHOUSE_API_KEY;

    const userResponse = await lighthouse.textUploadEncrypted(
      shippingAddress,
      apiKey,
      userPublicKey,
      userSign
    );

    console.log(userResponse);
    const userHash = userResponse.hash;
    const userShippingAddress = await axios.get(
      "https://gateway.lighthouse.storage/ipfs/" + userHash
    );

    const vendorResponse = await lighthouse.textUploadEncrypted(
      shippingAddress,
      apiKey,
      vendorPublicKey,
      vendorSign
    );

    const vendorHash = vendorResponse.hash;

    const vendorShippingAddress = await axios.get(
      "https://gateway.lighthouse.storage/ipfs/" + vendorHash
    );

    return res.status(200).send({
      userShippingAddress,
      vendorShippingAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error uploading address",
    });
  }
});

export default router;

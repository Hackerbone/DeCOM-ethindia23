const { ethers } = require("ethers");
const express = require("express");
const { PushAPI, CONSTANTS } = require("@pushprotocol/restapi");
const router = express.Router();

router.post("/trigger-notification", async (req, res) => {
  // check if req.body.subscribers is empty and then return message "no subscribers found"
  // if not empty then send notification to all subscribers
  // const subscribers = req.body.subscribers;
  // const notification = req.body.notification;

  if (req.body.subscribers.length === 0) {
    return res.send("no subscribers found");
  }

  let noti = {
    title: req.body.title,
    body: req.body.notibody,
  };

  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey);

  const user = await PushAPI.initialize(wallet, {
    env: CONSTANTS.ENV.STAGING,
  });

  const response = await user.channel.send(req.body.subscribers, {
    notification: noti,
  });

  console.log(response);
  return res.send(response);
});

// export router

module.exports = router;

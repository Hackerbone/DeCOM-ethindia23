import express from "express";
import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

const router = express.Router();

router.post("/trigger-notification", async (req, res) => {
  // check if req.body.subscribers is empty and then return message "no subscribers found"
  // if not empty then send notification to all subscribers
  // const subscribers = req.body.subscribers;
  // const notification = req.body.notification;
  try {
    if (req.body.subscribers.length === 0) {
      return res.status(500).send("no subscribers found");
    }
    let noti = {
      title: req.body.title,
      body: req.body.notibody,
    };

    const privateKey = process.env.PRIVATE_KEY;
    console.log(privateKey);
    const wallet = new ethers.Wallet(privateKey);

    const user = await PushAPI.initialize(wallet, {
      env: CONSTANTS.ENV.STAGING,
    });

    console.log("check");

    try {
      const response = await user.channel.send(req.body.subscribers, {
        notification: noti,
      });
    } catch (err) {
      console.log(err);
      // return res.status(500).send("error");
    }

    return res.status(200).json({ message: "notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error, "error");
  }
});

// export router

export default router;

// Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

// // Creating a random signer from a wallet, ideally this is the wallet you will connect
// const signer = ethers.Wallet.createRandom();

// const userAlice = await PushAPI.initialize(signer, {
//   env: CONSTANTS.ENV.STAGING,
// });

// // List inbox notifications
// const inboxNotifications = await userAlice.notification.list("INBOX");

// // List spam notifications
// const spamNotifications = await userAlice.notification.list("SPAM");

// const pushChannelAdress = "0xd5C4E1A40dbb6b74828A4C3E6809C8f1D1f4f5f5";

// // Subscribe to push channel
// await userAlice.notification.subscribe(
//   `eip155:11155111:${pushChannelAdress}` // channel address in CAIP format
// );

// // Send notification, provided userAlice has a channel
// const response = await userAlice.channel.send(["*"], {
//   notification: {
//     title: "You awesome notification",
//     body: "from your amazing protocol",
//   },
// });

export const sendNotification = async (channelAddress, notification) => {
  const signer = ethers.Wallet.createRandom();
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });
  await user.notification.subscribe(
    `eip155:1442:${channelAddress}` // channel address in CAIP format
  );
  const response = await user.channel.send(["*"], {
    notification: notification,
  });
  return response;
};

export const subscribeToChannel = async (channelAddress) => {
  const signer = ethers.Wallet.createRandom();
  console.log(signer);
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });
  let res = await user.notification.subscribe(
    `eip155:1442:${channelAddress}` // channel address in CAIP format
  );
  console.log(res);
};

// export const recieveMessage = async (channelAddress) => {
//   const signer = ethers.Wallet.createRandom();
//   const user = await PushAPI.initialize(signer, {
//     env: CONSTANTS.ENV.STAGING,
//   });
//   await user.notification.subscribe(
//     `eip155:1442:${channelAddress}` // channel address in CAIP format
//   );
//   const response = await user.channel.send(["*"], {
//     notification: {
//       title: "You awesome notification",
//       body: "from your amazing protocol",
//     },
//   });
//   return response;
// }

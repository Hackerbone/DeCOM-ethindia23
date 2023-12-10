// Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import axios from "axios";

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

// export const sendNotification = async ({ channelAddress, notification }) => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);

//     const signer = await provider.getSigner();

//     const user = await PushAPI.initialize(signer, {
//       env: CONSTANTS.ENV.STAGING,
//     });
//     // await user.notification.subscribe(
//     //   `eip155:1442:${channelAddress}` // channel address in CAIP format
//     // );
//     const response = await user.channel.send(["*"], {
//       notification: { title: "test", body: notification },
//     });
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const triggerNotification = async (address, channelAddress, message) => {
//   try {
//   } catch (error) {}
// };

export const callTriggerNotification = async (subscribers, title, notibody) => {
  try {
    const { data } = await axios.post(
      "https://decom-push.onrender.com/api/push/trigger-notification",
      {
        subscribers,
        title,
        notibody,
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const subscribeToChannel = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });
  let res = await user.notification.subscribe(
    `eip155:11155111:0x5a8D9A884eB721dB9d2a1EA7BA6EA58F257C35E7` // channel address in CAIP format
  );
  console.log("subscribe", res);
};

export const readMessages = async (channelAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });
  const response = await user.notification.list("INBOX");

  return response;
};

export const pushChat = async (recieverAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    let reciever_address = "0x5a8D9A884eB721dB9d2a1EA7BA6EA58F257C35E7";

    const sendMessage = await user.chat.send(reciever_address, {
      content: "Gm gm! its kathan from ethindia",
    });

    // Initialize Stream
    const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);

    // Configure stream listen events and what to do
    stream.on(CONSTANTS.STREAM.CHAT, (message) => {
      console.log(message);
    });
    // Connect Stream
    stream.connect();
  } catch (error) {
    console.log(error);
  }
};

// export const createChannel = async () => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const user = await PushAPI.initialize(signer, {
//       env: CONSTANTS.ENV.STAGING,
//     });
//     console.log(await signer.getAddress());
//     const response = await user.channel.create({
//       name: "Test Channel",
//       description: "Test Description",
//       icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
//       url: "https://decom.org",
//       alias: `eip155:1442:${await signer.getAddress()}`,
//     });
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// verify alias address

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

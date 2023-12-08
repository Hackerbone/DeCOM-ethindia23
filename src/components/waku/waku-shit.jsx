// import { useState, useEffect } from "react";
// import {
//   useWaku,
//   useLightPush,
//   useFilterMessages,
//   useStoreMessages,
// } from "@waku/react";
// import { createEncoder, createDecoder } from "@waku/sdk";
// import protobuf from "protobufjs";
// import "../../styles/components/waku.module.scss";

// function WakuComp() {
//   const [inputMessage, setInputMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   // Update the inputMessage state as the user input changes
//   const handleInputChange = (e) => {
//     setInputMessage(e.target.value);
//   };

//   // Create and start a Light Node
//   const { node, error, isLoading } = useWaku();

//   // Create a message encoder and decoder
//   const contentTopic = "/waku-react-guide/1/chat/proto";
//   const encoder = createEncoder({ contentTopic });
//   const decoder = createDecoder(contentTopic);

//   // Bind push method to a node and encoder
//   const { push } = useLightPush({ encoder, node });

//   // Query Store peers for past messages
//   const { messages: storeMessages } = useStoreMessages({ node, decoder });

//   // Receive messages from Filter subscription
//   const { messages: filterMessages } = useFilterMessages({ node, decoder });

//   // Create a message structure using Protobuf
//   const ChatMessage = new protobuf.Type("ChatMessage")
//     .add(new protobuf.Field("timestamp", 1, "uint64"))
//     .add(new protobuf.Field("message", 2, "string"));

//   // Send the message using Light Push
//   const sendMessage = async () => {
//     if (!push || inputMessage.length === 0) return;

//     // Create a new message object
//     const timestamp = Date.now();
//     const protoMessage = ChatMessage.create({
//       timestamp: timestamp,
//       message: inputMessage,
//     });

//     // Serialise the message and push to the network
//     const payload = ChatMessage.encode(protoMessage).finish();
//     console.log({ payload, timestamp });
//     const { recipients, errors } = await push(encoder, { payload: payload });
//     console.log({ recipients, errors });
//     // Check for errors
//     if (errors.length === 0) {
//       setInputMessage("");
//       console.log("MESSAGE PUSHED");
//     } else {
//       console.log(errors);
//     }
//   };

//   useEffect(() => {
//     //if isloading is true, return
//     if (isLoading) return;
//     //if error is true, return
//     setMessages(
//       filterMessages.map((wakuMessage) => {
//         if (!wakuMessage.payload) return null;
//         return ChatMessage.decode(wakuMessage.payload);
//       })
//     );
//     const allMessages = storeMessages.concat(filterMessages);
//     console.log({ allMessages });
//     setMessages(
//       allMessages.map((wakuMessage) => {
//         if (!wakuMessage.payload) return null;
//         return ChatMessage.decode(wakuMessage.payload);
//       })
//     );
//   }, [filterMessages, storeMessages]);

//   return (
//     <>
//       <div className="chat-interface">
//         <h1>Waku React Demo</h1>
//         <div className="chat-body">
//           {messages.map((message, index) => (
//             <div key={index} className="chat-message">
//               <span>{new Date(message.timestamp).toUTCString()}</span>
//               <div className="message-text">{message.message}</div>
//             </div>
//           ))}
//         </div>
//         <div className="chat-footer">
//           <input
//             type="text"
//             id="message-input"
//             value={inputMessage}
//             onChange={handleInputChange}
//             placeholder="Type your message..."
//           />
//           <button className="send-button" onClick={sendMessage}>
//             Send
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default WakuComp;

// import {
//     DecodedMessage,
//     LightNode,
//     createDecoder,
//     createEncoder,
//     createLightNode,
//     waitForRemotePeer,
//   } from "@waku/sdk";

//   import { useState, useEffect } from "react";

//   import protobuf from "protobufjs";

//   const contentTopic = "/waku/decom-ethglobal";
//   const encoder = createEncoder({ contentTopic });
//   const decoder = createDecoder(contentTopic);

//   const ChatMessage = new protobuf.Type("ChatMessage")
//     .add(new protobuf.Field("timestamp", 1, "uint64"))
//     .add(new protobuf.Field("sender", 2, "string"))
//     .add(new protobuf.Field("message", 3, "string"));

//   // create a function that creates and starts a light node
//   const createNode = async () => {
//     const node = await createLightNode({
//       defaultBootstrap: true,
//     });
//     await node.start();
//     await waitForRemotePeer(node);
//     return node;
//   };
//   // create a function that subscribes to incoming messages

//   const subscribeToMessages = async (node) => {
//     const _callback = (message) => {
//       console.log("found", message);
//     };

//     const subscription = await node.filter.createSubscription();
//     await subscription.subscribe([decoder], _callback);
//   };

//   const sendMessage = async (node, message) => {
//     // Create a new message object
//     const protoMessage = ChatMessage.create({
//       timestamp: Date.now(),
//       message: message,
//     });

//     // Serialise the message using Protobuf
//     const serialisedMessage = ChatMessage.encode(protoMessage).finish();

//     // Send the message using Light Push
//     await node.lightPush.send(encoder, {
//       payload: serialisedMessage,
//     });
//   };

//   function WakuComp() {
//     const [wakuNode, setWakuNode] = useState(null);
//     const [inputMessage, setInputMessage] = useState(""); // Declare and initialize inputMessage state variable
//     const [messages, setMessages] = useState(["default"]);

//     useEffect(() => {
//       if (wakuNode) return;
//       (async () => {
//         const node = await createNode();
//         setWakuNode(node);
//       })();
//     }, [wakuNode]);

//     useEffect(() => {
//       if (!wakuNode) return;
//       (async () => {
//         await subscribeToMessages(wakuNode);
//       })();
//     });

//     const handleInputChange = (event) => {
//       setInputMessage(event.target.value);
//     };

//     return (
//       <div>
//         <div>
//           <h1>Waku React Demo</h1>
//           <div>
//             {messages.map((message, index) => (
//               <div key={index}>
//                 {message.sender} - {message.message}
//               </div>
//             ))}
//           </div>
//           <div>
//             <input
//               type="text"
//               value={inputMessage} // Use the inputMessage state variable here
//               onChange={handleInputChange}
//             />
//             <button onClick={() => sendMessage(wakuNode, inputMessage)}>
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   export default WakuComp;

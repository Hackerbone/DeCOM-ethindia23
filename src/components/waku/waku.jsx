import {
  DecodedMessage,
  LightNode,
  createDecoder,
  createEncoder,
  createLightNode,
  waitForRemotePeer,
} from "@waku/sdk";

import { useState, useEffect } from "react";

import protobuf from "protobufjs";

const contentTopic = "/waku/decom-ethglobal";
const encoder = createEncoder({ contentTopic });
const decoder = createDecoder(contentTopic);

const ChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));

// create a function that creates and starts a light node
const createNode = async () => {
  const node = await createLightNode({
    defaultBootstrap: true,
  });
  await node.start();
  await waitForRemotePeer(node);
  return node;
};
// create a function that subscribes to incoming messages

const subscribeToMessages = async (node) => {
  const _callback = (message) => {
    console.log("found", message);
  };

  const subscription = await node.filter.createSubscription();
  await subscription.subscribe([decoder], _callback);
};

const sendMessage = async (node, message) => {
  // Create a new message object
  const protoMessage = ChatMessage.create({
    timestamp: Date.now(),
    message: message,
  });

  // Serialise the message using Protobuf
  const serialisedMessage = ChatMessage.encode(protoMessage).finish();

  // Send the message using Light Push
  await node.lightPush.send(encoder, {
    payload: serialisedMessage,
  });
};

function WakuComp() {
  const [wakuNode, setWakuNode] = useState(null);
  const [inputMessage, setInputMessage] = useState(""); // Declare and initialize inputMessage state variable
  const [messages, setMessages] = useState(["default"]);

  useEffect(() => {
    if (wakuNode) return;
    (async () => {
      const node = await createNode();
      setWakuNode(node);
    })();
  }, [wakuNode]);

  useEffect(() => {
    if (!wakuNode) return;
    (async () => {
      await subscribeToMessages(wakuNode);
    })();
  });

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  return (
    <div>
      <div>
        <h1>Waku React Demo</h1>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              {message.sender} - {message.message}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={inputMessage} // Use the inputMessage state variable here
            onChange={handleInputChange}
          />
          <button onClick={() => sendMessage(wakuNode, inputMessage)}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default WakuComp;

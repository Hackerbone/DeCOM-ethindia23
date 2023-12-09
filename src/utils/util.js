// write  a function which takes in networkName as an argument and returns the
// corresponding contract address from the env

export const getContractAddress = (networkName) => {
  switch (networkName) {
    case "ganache":
      return process.env.REACT_APP_CONTRACT_ADDRESS_GANACHE;
    default:
      return process.env.REACT_APP_CONTRACT_ADDRESS_SEPOLIA;
  }
};

export const query = (address) => {
  return `
query MyQuery {
  Wallet(input: {identity: "${address}", blockchain: ethereum}) {
    socials {
      profileName
    }
  }
}
`;
};

const REACT_APP_AIRSTACK_API_URL = process.env.REACT_APP_AIRSTACK_API_URL;

export const getNftWall2023 = async (owner_address) => {
  const response = await fetch(`${REACT_APP_AIRSTACK_API_URL}/nft/${owner_address}`);
  const data = await response.json();
  return data;
}
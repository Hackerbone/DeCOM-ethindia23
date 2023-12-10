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

export const getNftWall2023 = async (owner_address) => {
  const response = await fetch(`https://airstack-nft-wall.onrender.com/nft/${owner_address}`);
  const data = await response.json();
  return data;
}
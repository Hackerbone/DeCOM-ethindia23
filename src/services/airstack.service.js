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

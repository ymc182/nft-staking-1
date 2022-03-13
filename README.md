Most of the Contract Setting with be in .env File,

REACT_APP_NFT_CONTRACT_ADDRESS=0x3C6CED26163125ab1985DF8cce4e6B4D4ed953E9 <- NFT contract address
REACT_APP_FARM_CONTRACT_ADDRESS=0x1b70039D79d4Ec6e13F52f7D2E0821939450EE36 <- Farm contract address
REACT_APP_CHAIN_ID=97 <- Chain ID

these are the only setting you need on frontend

=================================================

For Contract
1.) Deploy NFT Contract
2.) Deploy Token Contract
3.) Deploy Farm Contract with the address of NFT Contract

4.) Set the NFT Contract Address in Farm Contract && Set the Token Contract Address in Farm Contract
5.) Mint Tokens into Farm Contract
6.) Setup all Address in .env file and copy abi from remix into each json file accordingly
7.) deploy to Vercel with setting CI to false or any hosting you desired.
Done

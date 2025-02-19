require("@nomicfoundation/hardhat-toolbox");

const NEXT_PUBLIC_POLYGON_MUMBAI_RPC = "https://rpc.ankr.com/polygon_amoy";
const NEXT_PUBLIC_PRIVATE_KEY = "6e97c525f2551eac0e6722059e188b34f0ba2d9b39f5ed66c407483f1e5bb543";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
    networks: {
      // hardhat: {
      //   chainId: 31337,
      // },
      polygon_amoy: {
        url: NEXT_PUBLIC_POLYGON_MUMBAI_RPC,
        accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
      },
    },
  },
};

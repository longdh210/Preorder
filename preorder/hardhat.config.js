require("@nomicfoundation/hardhat-toolbox");
const key = require("./key.json");

module.exports = {
    networks: {
        hardhat: {
            chainId: 1337,
        },
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/kAPtSA_EMLRedffB6D1Ehre3rQQ2pmn2",
            accounts: [key.PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: key.API_KEY,
    },
    solidity: "0.8.4",
};

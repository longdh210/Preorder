const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const { landTokenAddress } = require("../../config");
const LandContract = require("../../artifacts/contracts/Land.sol/Land.json");

// Create instant
const web3 = new Web3(
    "wss://rinkeby.infura.io/ws/v3/a2cfc47d9a4f408ea304fef5b70e5599"
);

const landContract = new web3.eth.Contract(LandContract.abi, landTokenAddress);

router.get("/", async (req, res) => {
    try {
        const data = await landContract.methods.totalSupply().call();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

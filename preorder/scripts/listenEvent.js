const Web3 = require("web3");
const ownerKey = require("../key.json");
const { preorderTokenAddress, landTokenAddress } = require("../config");
const PreorderContract = require("../artifacts/contracts/PreorderToken.sol/PreorderToken.json");
const LandContract = require("../artifacts/contracts/Land.sol/Land.json");

// Create instant
const web3 = new Web3(
    "wss://rinkeby.infura.io/ws/v3/a2cfc47d9a4f408ea304fef5b70e5599"
);

const preorderContract = new web3.eth.Contract(
    PreorderContract.abi,
    preorderTokenAddress
);
const landContract = new web3.eth.Contract(LandContract.abi, landTokenAddress);

const { address: admin } = web3.eth.accounts.wallet.add(ownerKey.PRIVATE_KEY);

// const run = async () => {
//     let gasPrice = await web3.eth.getGasPrice();
//     gasPrice = gasPrice + 10;
//     console.log(gasPrice);
// };

// run();
preorderContract.events
    .Burn({}, function (error, event) {
        // console.log("Event:", event);
        // console.log("Error:", error);
    })
    .on("data", async (event) => {
        console.log(event);
        // Get data from event
        const { burner, tokenId } = event.returnValues;

        const tx = landContract.methods.ownerTransfer(admin, burner, tokenId);
        let [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({ from: admin }),
        ]);

        gasPrice += 10;

        const data = tx.encodeABI();
        const txData = {
            from: admin,
            to: landContract.options.address,
            data,
            gas: gasCost,
            gasPrice,
        };
        const receipt = await web3.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
            Processed transfer:
            - from ${admin}
            - to ${burner}
        `);
    });

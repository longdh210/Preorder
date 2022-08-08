const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const Preorder = await hre.ethers.getContractFactory("PreorderToken");
    const preorder = await Preorder.deploy();

    await preorder.deployed();

    console.log("Preorder token deployed to:", preorder.address);
    fs.writeFileSync(
        "./config.js",
        `export const preorderTokenAddress = "${preorder.address}"`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

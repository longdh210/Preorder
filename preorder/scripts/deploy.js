const hre = require("hardhat");
const fs = require("fs");
const key = require("../key.json");

async function main() {
    const Land = await hre.ethers.getContractFactory("Land");
    const land = await Land.deploy(key.OWNER);

    await land.deployed();

    const Preorder = await hre.ethers.getContractFactory("PreorderToken");
    const preorder = await Preorder.deploy(key.OWNER, land.address);

    await preorder.deployed();

    console.log("Preorder token deployed to:", preorder.address);
    console.log("Land token deployed to:", land.address);

    fs.writeFileSync(
        "./config.js",
        `const preorderTokenAddress = "${preorder.address}"
        const landTokenAddress = "${land.address}"
        module.exports = {preorderTokenAddress, landTokenAddress};
        `
    );
    fs.writeFileSync(
        "../preorder-ui/src/config.js",
        `export const preorderTokenAddress = "${preorder.address}"
        export const landTokenAddress = "${land.address}"
        `
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

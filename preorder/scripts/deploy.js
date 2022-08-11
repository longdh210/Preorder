const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const Preorder = await hre.ethers.getContractFactory("PreorderToken");
    const preorder = await Preorder.deploy();

    const Land = await hre.ethers.getContractFactory("Land");
    const land = await Land.deploy(
        "0x3797786150d38aa2588ac2BcFb162a61e2A69638"
    );

    await preorder.deployed();
    await land.deployed();

    console.log("Preorder token deployed to:", preorder.address);
    console.log("Preorder token deployed to:", land.address);

    fs.writeFileSync(
        "./config.js",
        `const preorderTokenAddress = "${preorder.address}"
        const landTokenAddress = "${land.address}"
        module.exports = {preorderTokenAddress, landTokenAddress};
        `
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Land contract", function () {
    async function deployTokenFixture() {
        const Land = await ethers.getContractFactory("Land");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const land = await Land.deploy(owner.address);

        await land.deployed();

        return { land, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { land, owner } = await loadFixture(deployTokenFixture);

            expect(await land.owner()).to.equal(owner.address);
        });
    });

    describe("Set Preorder contract", function () {
        it("Should set preorder contract address successfully", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            const PreorderToken = await ethers.getContractFactory(
                "PreorderToken"
            );
            const preorderToken = await PreorderToken.deploy(
                owner.address,
                land.address
            );
            await preorderToken.deployed();

            expect(await land.setPreorderContract(preorderToken.address)).to
                .change;
        });
    });

    describe("Mint", function () {
        it("Should revert if account don't have Preorder token", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            const PreorderToken = await ethers.getContractFactory(
                "PreorderToken"
            );
            const preorderToken = await PreorderToken.deploy(
                owner.address,
                land.address
            );
            await preorderToken.deployed();

            // Set Preorder contract address for Land contract to interact
            await land.setPreorderContract(preorderToken.address);
            // Mint 1 preorder token to addr1
            await expect(land.safeMint(addr1.address, 1)).to.be.revertedWith(
                "You have not burn Preorder token yet"
            );
        });

        // it("Should revert if account is not token's owner", async function () {
        //     const { land, owner, addr1, addr2 } = await loadFixture(
        //         deployTokenFixture
        //     );
        //     const PreorderToken = await ethers.getContractFactory(
        //         "PreorderToken"
        //     );
        //     const preorderToken = await PreorderToken.deploy(land.address);
        //     await preorderToken.deployed();

        //     await preorderToken.connect(addr1).safeMint(addr1.address, {
        //         value: ethers.utils.parseUnits("0.1", "ether"),
        //     });

        //     await land.setPreorderContract(preorderToken.address);

        //     // Mint 1 preorder token to owner
        //     await expect(
        //         land.connect(addr2).safeMint(addr2.address, 1)
        //     ).to.be.revertedWith("You can not mint Land token");
        // });
    });

    describe("Transactions", function () {
        it("Should revert transaction (token locked 3 months)", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            const PreorderToken = await ethers.getContractFactory(
                "PreorderToken"
            );
            const preorderToken = await PreorderToken.deploy(
                owner.address,
                land.address
            );
            await preorderToken.deployed();

            await preorderToken.connect(addr1).safeMint(addr1.address, {
                value: ethers.utils.parseUnits("0.1", "ether"),
            });

            // Set Preorder contract address for Land contract to interact
            await land.setPreorderContract(preorderToken.address);

            // Swap (burn) token from Preorder contract
            await preorderToken.connect(addr1).burn(1);

            // Mint 1 preorder token to owner
            await expect(
                land
                    .connect(addr1)
                    .transferFrom(addr1.address, addr2.address, 1)
            ).to.be.revertedWith("Token locked");
        });
    });
});

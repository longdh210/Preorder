const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Land contract", function () {
    async function deployTokenFixture() {
        const Land = await ethers.getContractFactory("Land");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const land = await Land.deploy(owner.address);

        await land.deployed();

        return { Land, land, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { land, owner } = await loadFixture(deployTokenFixture);

            expect(await land.owner()).to.equal(owner.address);
        });
    });

    describe("Mint", function () {
        it("Should mint 1 Land token for account", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint 1 preorder token to owner
            expect(await land.safeMint(owner.address)).to.changeTokenBalance(
                land,
                owner,
                1
            );
        });

        it("Should mint 5 Land tokens for account", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint 5 preorder tokens to addr1
            expect(
                await land.safeMintMany(addr1.address, 5)
            ).to.changeTokenBalance(land, addr1, 5);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens from owner to user", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint Land tokens for owner
            await land.safeMintMany(owner.address, 1);
            // Transfer 10 tokens from owner to addr1
            await expect(
                land.ownerTransfer(owner.address, addr1.address, 1)
            ).to.changeTokenBalances(land, [owner, addr1], [-1, 1]);
        });

        it("Should revert transaction", async function () {
            const { land, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint Land tokens for owner
            await land.safeMintMany(owner.address, 1);
            // Transfer 10 tokens from owner to addr1
            await expect(
                land.ownerTransfer(owner.address, addr1.address, 1)
            ).to.changeTokenBalances(land, [owner, addr1], [-1, 1]);

            // Transfer 1 token from addr1 to addr2
            await expect(
                land
                    .connect(addr1)
                    .transferFrom(addr1.address, addr2.address, 1)
            ).to.be.revertedWith("Token locked");
        });
    });
});

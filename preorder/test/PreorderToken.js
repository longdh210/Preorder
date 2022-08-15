const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("PreorderToken contract", function () {
    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const PreorderToken = await ethers.getContractFactory("PreorderToken");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const preorderToken = await PreorderToken.deploy();

        await preorderToken.deployed();

        return { PreorderToken, preorderToken, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { preorderToken, owner } = await loadFixture(
                deployTokenFixture
            );

            expect(await preorderToken.owner()).to.equal(owner.address);
        });
    });

    describe("Get and set fee", function () {
        it("Should get fee successfully", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Get fee
            expect(await preorderToken.getFee()).to.equal(
                ethers.utils.parseUnits("0.01", "ether")
            );
        });

        it("Should set fee successfully", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Set fee
            expect(await preorderToken.setFee(1)).to.change;
        });
    });

    describe("Mint", function () {
        it("Should mint 1 token for account", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint 1 preorder token to owner
            expect(
                await preorderToken.safeMint(owner.address, {
                    value: ethers.utils.parseUnits("0.1", "ether"),
                })
            ).to.changeTokenBalance(preorderToken, owner, 1);
        });

        it("Should mint 5 tokens for account", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint 5 preorder tokens to addr1
            expect(
                await preorderToken.safeMintMany(addr1.address, 5, {
                    value: ethers.utils.parseUnits("0.5", "ether"),
                })
            ).to.changeTokenBalance(preorderToken, addr1, 5);
        });
    });

    describe("Burn", function () {
        it("Should emit Burn events", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            // Mint 1 preorder token to owner
            await preorderToken.safeMint(owner.address, {
                value: ethers.utils.parseUnits("0.1", "ether"),
            });
            // Burn
            expect(await preorderToken.burn(1))
                .to.emit(preorderToken, "Burn")
                .withArgs(1);
        });
    });

    describe("Withdraw", function () {
        it("Should withdraw successfully", async function () {
            const { preorderToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            // Deposit ether to contract
            await preorderToken.safeMint(addr1.address, {
                value: ethers.utils.parseUnits("1", "ether"),
            });
            // Withdraw
            expect(await preorderToken.withdraw()).to.changeTokenBalance(
                preorderToken,
                owner,
                1
            );
        });
    });
});

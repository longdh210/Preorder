import logo from "./logo.svg";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import ContractABI from "./artifacts/contracts/PreorderToken.sol/PreorderToken.json";
import { preorderTokenAddress } from "./config";
import { balanceOf } from "./components/balance";
import { balanceOfLand } from "./components/balanceLand";
import { totalSupply } from "./components/totalSupply";
import { useEffect, useState } from "react";

function App() {
    const [amount, setAmount] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [currentAddress, setCurrentAddress] = useState(null);
    const [balancePreorder, setBalancePreorder] = useState(0);
    const [balanceLand, setBalanceLand] = useState(0);
    const [totalSupplyAmount, setTotalSupplyAmount] = useState(0);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then(async (res) => {
                    setBalancePreorder(await balanceOf(res[0]));
                    setBalanceLand(await balanceOfLand(res[0]));
                    setCurrentAddress(res[0]);
                    setTotalSupplyAmount(await totalSupply());
                });
        }
    }, []);

    window.ethereum.on("accountsChanged", async function (accounts) {
        setCurrentAddress(accounts[0]);
        setBalancePreorder(await balanceOf(accounts[0]));
        setBalanceLand(await balanceOfLand(accounts[0]));
    });

    const handleBuyClick = async () => {
        if (!amount) {
            alert("Enter amount");
        } else {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();

            const valueAmount = 0.01 * amount;

            let valuePass = ethers.utils.parseUnits(`${valueAmount}`, "ether");
            valuePass = valuePass.toString();

            let contract = new ethers.Contract(
                preorderTokenAddress,
                ContractABI.abi,
                signer
            );
            let transaction = await contract.safeMintMany(
                signerAddress,
                amount,
                {
                    value: valuePass,
                }
            );
            await transaction.wait();

            alert("Buy token successfully");
        }
    };

    const handleSwapClick = async () => {
        if (!tokenId) {
            alert("Enter token id");
        } else if (Number(tokenId) > Number(totalSupplyAmount)) {
            alert("The id exceeds total supply");
        } else {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            // const signerAddress = await signer.getAddress();

            const valueAmount = 0.01 * amount;

            let valuePass = ethers.utils.parseUnits(`${valueAmount}`, "ether");
            valuePass = valuePass.toString();

            let contract = new ethers.Contract(
                preorderTokenAddress,
                ContractABI.abi,
                signer
            );
            let transaction = await contract.burn(tokenId);
            await transaction.wait();

            alert("Swap token successfully");
        }
    };

    return (
        <div className='App'>
            <div className='balance'>
                <label
                    style={{
                        color: "white",
                        fontSize: "30px",
                    }}
                >
                    Preorder Token Balance: {balancePreorder.toString()}
                </label>
                <br></br>
                <label
                    style={{
                        color: "white",
                        fontSize: "30px",
                    }}
                >
                    Land Token Balance: {balanceLand.toString()}
                </label>
            </div>
            <div className='content'>
                <h1
                    style={{
                        color: "white",
                        fontSize: "100px",
                    }}
                >
                    Preorder
                </h1>
                <br></br>
                <input
                    placeholder='Amount of token want to buy'
                    style={{
                        height: "30px",
                        width: "200px",
                    }}
                    onChange={(e) => setAmount(e.target.value)}
                ></input>
                <br></br>
                <button
                    style={{
                        height: "60px",
                        width: "120px",
                        background: "#4DC1BF",
                        borderRadius: "10px",
                        marginTop: "10px",
                        color: "white",
                        fontWeight: "bold",
                    }}
                    onClick={handleBuyClick}
                >
                    Buy Preorder NFT
                </button>
                <br></br>
                <input
                    placeholder='Token id want to swap'
                    style={{
                        height: "30px",
                        width: "200px",
                        marginTop: "10px",
                    }}
                    onChange={(e) => setTokenId(e.target.value)}
                ></input>
                <br></br>
                <button
                    style={{
                        height: "60px",
                        width: "120px",
                        background: "#FF7373",
                        borderRadius: "10px",
                        marginTop: "10px",
                        color: "white",
                        fontWeight: "bold",
                    }}
                    onClick={handleSwapClick}
                >
                    Swap to Land
                </button>
            </div>
        </div>
    );
}

export default App;

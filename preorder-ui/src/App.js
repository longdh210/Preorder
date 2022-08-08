import logo from "./logo.svg";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import ContractABI from "./artifacts/contracts/PreorderToken.sol/PreorderToken.json";
import { preorderTokenAddress } from "./config";
import { balanceOf } from "./components/balance";
import { useEffect, useState } from "react";

function App() {
    const [currentAddress, setCurrentAddress] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then(async (res) => {
                    setBalance(await balanceOf(res[0]));
                    setCurrentAddress(res[0]);
                });
        }
    }, []);

    window.ethereum.on("accountsChanged", async function (accounts) {
        setCurrentAddress(accounts[0]);
        setBalance(await balanceOf(accounts[0]));
    });

    const handleBuyClick = async () => {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        let valuePass = ethers.utils.parseUnits("0.1", "ether");
        valuePass = valuePass.toString();

        let contract = new ethers.Contract(
            preorderTokenAddress,
            ContractABI.abi,
            signer
        );
        let transaction = await contract.safeMint(signerAddress, {
            value: valuePass,
        });
        await transaction.wait();

        alert("Add address successfully");
        // setCurrentAddress(signerAddress);
    };

    return (
        <div className='App'>
            <div className='content'>
                <h1
                    style={{
                        color: "white",
                        fontSize: "100px",
                    }}
                >
                    Preorder
                </h1>
                <label
                    style={{
                        color: "white",
                        fontSize: "50px",
                    }}
                >
                    NFT Balance: {balance.toString()}
                </label>
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
            </div>
        </div>
    );
}

export default App;

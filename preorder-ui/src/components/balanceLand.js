import { ethers } from "ethers";
import ContractABI from "../artifacts/contracts/Land.sol/Land.json";
import { landTokenAddress } from "../config";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const balanceOfLand = async (_address) => {
    const contract = new ethers.Contract(
        landTokenAddress,
        ContractABI.abi,
        provider
    );

    let result = await contract.balanceOf(_address);
    return result;
};

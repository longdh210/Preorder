import { ethers } from "ethers";
import ContractABI from "../artifacts/contracts/PreorderToken.sol/PreorderToken.json";
import { preorderTokenAddress } from "../config";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const balanceOf = async (_address) => {
    const contract = new ethers.Contract(
        preorderTokenAddress,
        ContractABI.abi,
        provider
    );

    let result = await contract.balanceOf(_address);
    return result;
};

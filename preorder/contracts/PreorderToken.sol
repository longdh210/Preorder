// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PreorderToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address payable public owner;

    uint256 private _fee = 0.1 ether;

    constructor() ERC721("PreorderToken", "POT") {
        owner = payable(msg.sender);
    }

    function getFee() public view returns (uint256) {
        return _fee;
    }

    function setFee(uint256 fee) public {
        _fee = fee * (1e17);
    }

    function safeMint(address to) public payable {
        require(msg.value >= _fee, "Not enough balance");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    function withdraw() public {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        uint256 amount = address(this).balance;

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to withdraw");
    }
}

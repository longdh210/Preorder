// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PreorderToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address payable public owner;

    uint256 private _fee = 0.01 ether;

    uint256 public constant MAX_SUPPLY = 1000;

    event Burn(address indexed burner, uint256 indexed tokenId);

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
        uint256 startId = _tokenIdCounter.current();
        require(startId <= MAX_SUPPLY, "Only supply 1000 Preorder Token");
        require(msg.value >= _fee, "Not enough balance");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    function safeMintMany(address to, uint256 amount) public payable {
        uint256 startId = _tokenIdCounter.current();
        require(
            startId + amount <= MAX_SUPPLY,
            "Only supply 1000 Preorder Token"
        );
        require(msg.value >= amount * _fee, "Not enough balance");
        uint256 tokenId;
        for (uint8 i = 0; i < amount; i++) {
            _tokenIdCounter.increment();
            tokenId = _tokenIdCounter.current();
            _safeMint(to, tokenId);
        }
    }

    function withdraw() public {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        uint256 amount = address(this).balance;

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not token owner nor approved"
        );
        _burn(tokenId);
        emit Burn(msg.sender, tokenId);
    }
}

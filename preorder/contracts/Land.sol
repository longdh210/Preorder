// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "./PreorderToken.sol";

contract Land is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) public tokenLockedFromTimestamp;

    event Swap(address indexed to, uint256 indexed tokenId);

    PreorderToken preorderToken;

    constructor(address owner) ERC721("Land", "LAND") {
        super._transferOwnership(owner);
    }

    function setPreorderContract(address preorderTokenAddress)
        public
        onlyOwner
    {
        preorderToken = PreorderToken(preorderTokenAddress);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.pinata.cloud/ipfs/QmRh2esBEgcyTR6DpGJ4nDk8qpQSyMopP4ipv9PAccv5pt";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, uint256 preorderTokenId) public {
        require(
            preorderToken.checkBurn(to) == 1,
            "You have not burn Preorder token yet"
        );
        require(
            tx.origin == preorderToken.ownerOf(preorderTokenId),
            "You can not mint Land token"
        );
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        string memory uri = string(abi.encodePacked());
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenLockedFromTimestamp[tokenId] = block.timestamp + (90 days);
    }

    function ownerTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external onlyOwner {
        safeTransferFrom(from, to, tokenId);
        tokenLockedFromTimestamp[tokenId] = block.timestamp + (90 days);
        emit Swap(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        require(
            tokenLockedFromTimestamp[tokenId] < block.timestamp,
            "Token locked"
        );
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

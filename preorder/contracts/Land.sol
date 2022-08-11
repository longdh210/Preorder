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

    constructor(address owner) ERC721("Land", "LAND") {
        super._transferOwnership(owner);
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

    function safeMint(address to) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        string memory uri = string(abi.encodePacked());
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMintMany(address to, uint256 amount) public onlyOwner {
        uint256 tokenId;
        for (uint8 i = 0; i < amount; i++) {
            _tokenIdCounter.increment();
            tokenId = _tokenIdCounter.current();
            string memory uri = string(abi.encodePacked());
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uri);
        }
    }

    function ownerTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external onlyOwner {
        safeTransferFrom(from, to, tokenId);
        tokenLockedFromTimestamp[tokenId] = block.timestamp + (90 days);
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

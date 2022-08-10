// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HeinekenTN is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string private _uriSuffix = ".json";

    constructor(address owner) ERC721("Truc Nhan X Starverse", "TNStar") {
        super._transferOwnership(owner);
    }

    function contractURI() public pure returns (string memory) {
        return
            "https://trucnhan-nfts.mypinata.cloud/ipfs/QmUn1kjpjkhFTMiBjJRLDMKQYmemdqmdJq2gGG9o4b386J/contract_metadata.json";
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://trucnhan-nfts.mypinata.cloud/ipfs/QmW1urnGXo9DGLezfF1uVPieSZ55ZPMxxU4Ga6G1vYUci6/trucnhan_";
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
        string memory uri = string(
            abi.encodePacked(Strings.toString(tokenId), _uriSuffix)
        );
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMintMany(address to, uint256 amount) public onlyOwner {
        uint256 tokenId;
        string memory uri;
        for (uint8 i = 0; i < amount; i++) {
            _tokenIdCounter.increment();
            tokenId = _tokenIdCounter.current();
            uri = string(
                abi.encodePacked(Strings.toString(tokenId), _uriSuffix)
            );
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uri);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

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

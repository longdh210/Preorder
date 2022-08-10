// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

contract Comic is ERC721, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 20000;
    // current genesis token id, default: 0, the first token will have ID of 1.
    uint256 public currentId = 0;
    string public baseComicURI;
    // end time (the current time + 365 days) to TokenEndTime, equal to 0 after mint.
    mapping(uint256 => uint256) public TokenEndTime;

    // emit an event after burning a comic token.
    event burnRecord(uint256 _tokenId, address from);

    constructor() ERC721("COMIC", "COMIC") {}

    function mint(uint256 amount) external onlyOwner {
        uint256 startId = currentId;
        require(
            startId + amount <= MAX_SUPPLY,
            "Only supply 20.000 Comic token"
        );

        currentId += amount;

        for (uint256 i = 1; i <= amount; i++) {
            _safeMint(msg.sender, startId + i);
        }
    }

    /**
     * @dev Return End time of a token ID (365 days) if exists
     *  Revert if the tokenId is invalid (0 or not minted yet)
     */
    function getTokenEndTime(uint256 _tokenId) external view returns (uint256) {
        address owner = ownerOf(_tokenId);
        require(owner != address(0), "This token was burnt or not exits");
        return TokenEndTime[_tokenId];
    }

    /**
     * @dev Return owner of a token id if exists
     *  Revert if the tokenId is invalid (0 or not minted yet)
     *  Return 0x0 if the tokenId has been burnt
     */
    function ownerOf(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (address)
    {
        require(
            tokenId <= currentId && tokenId > 0,
            "ComicERC721: invalid token id"
        );
        if (_exists(tokenId)) return super.ownerOf(tokenId);
        return address(0); // token id is burnt
    }

    function burn(address from, uint256 _tokenId) external {
        address operator = _msgSender();
        address owner = ownerOf(_tokenId);
        require(owner == msg.sender, "Only owner of token can burn ");
        require(
            msg.sender == from,
            "Only owner of token can call burn function"
        );
        _burn(_tokenId);
        emit burnRecord(_tokenId, from);
    }

    /**
     * @dev Only use for Owner of smart contract to transfer comic token to user.
     *  Add end time (the current time + 365 days) to TokenEndTime.
     */
    function ownerTransfer(
        address from,
        address to,
        uint256 _id
    ) external onlyOwner {
        approve(to, _id);
        safeTransferFrom(from, to, _id);
        TokenEndTime[_id] = block.timestamp + (365 days);
    }

    /**
     * @dev use for user to transfer their comic token to another user.
     *  Dont change to end time.
     */
    function userTransfer(
        address from,
        address to,
        uint256 _id
    ) external {
        safeTransferFrom(from, to, _id);
    }

    function setBaseURI(string calldata _uri) external onlyOwner {
        baseComicURI = _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseComicURI;
    }
}

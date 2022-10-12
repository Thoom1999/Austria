// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/INFTMinter.sol";

contract NFTMinter is ERC721Enumerable, INFTMinter {
    using Counters for Counters.Counter;

    Counters.Counter public myNFTMinterCounter;

    struct MyNFTMinter {
        string image;
        string description;
        uint256 id;
    }

    mapping(uint256 => MyNFTMinter) public nftMinters;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function generateNFTMiner(
        uint256 id,
        string memory image,
        string memory description
    ) internal pure returns (MyNFTMinter memory) {
        return MyNFTMinter(image, description, id);
    }

    function mint(
        address to,
        string memory image,
        string memory description
    ) external override {
        uint256 id = myNFTMinterCounter.current();
        _mint(to, id);
        nftMinters[id] = generateNFTMiner(id, image, description);
        myNFTMinterCounter.increment();
        emit Mint(to, id);
    }

    function NFTsOfArtist(address _owner)
        external
        view
        override
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; ) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
            unchecked {
                ++i;
            }
        }
        return tokenIds;
    }
}

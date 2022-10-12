// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFTMinter is IERC721 {
    event Mint(address to, uint256 id);

    function mint(
        address to,
        string memory image,
        string memory description
    ) external;

    function NFTsOfArtist(address _owner)
        external
        view
        returns (uint256[] memory);
}

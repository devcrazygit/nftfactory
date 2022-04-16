//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IDgNft is IERC721 {
    function initialize(
        uint256[] memory statuses,
        uint256[] memory prices,
        string memory _baseTokenUri
    ) external;
}
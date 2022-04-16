//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './interfaces/IDgNft.sol';
import './DgNft.sol';
import "hardhat/console.sol";

contract DgNftFactory {

    event DgNftCreated(address indexed nftAddress, uint256);

    address public feeTo;
    address public feeToSetter;

    address[] public allNfts;
    uint256 public deployedNftLength;

    mapping(address => uint256) private _ownerNftsLength;
    mapping(address => address[]) private _ownerNfts;


    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function createNft(
        string memory name, 
        string memory symbol,
        uint256[] memory statuses,
        uint256[] memory prices,
        string memory _baseTokenUri
    ) external returns (address nftAddress) {
        bytes memory bytecode = _getCreationBytecode(name, symbol, msg.sender);
        bytes32 salt = keccak256(abi.encodePacked("Dgnft-", msg.sender));
        assembly {
            nftAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
            if iszero(extcodesize(nftAddress)) {
                revert(0, 0)
            }
        }
        IDgNft(nftAddress).initialize(statuses, prices, _baseTokenUri);
        allNfts.push(nftAddress);
        deployedNftLength++;

        _ownerNfts[msg.sender].push(nftAddress);
        _ownerNftsLength[msg.sender]++;
        emit DgNftCreated(nftAddress, _ownerNftsLength[msg.sender]);

        return nftAddress;
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'DgNftFactory: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'DgNftFactory: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }

    function totalNftsOfOwner(address owner) external view returns (uint256) {
        return _ownerNftsLength[owner];
    }

    function nftAddressOfOwnerByIndex(address owner, uint256 index) external view returns (address) {
        require(index < _ownerNftsLength[owner], "Index out of bounds");
        return _ownerNfts[owner][index];
    }

    function _getCreationBytecode(string memory name, string memory symbol, address owner) public pure returns (bytes memory) {
        bytes memory bytecode = type(DgNft).creationCode;

        return abi.encodePacked(bytecode, abi.encode(name, symbol, owner));
    }
}
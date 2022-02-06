pragma solidity ^0.8.11;

// ----------------------------------------------------------------------------
// The standard Owned base implementation
// ----------------------------------------------------------------------------

//SPDX-License-Identifier: LGPL
contract Owned {
    address public currentOwner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() {
        currentOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == currentOwner, "Only owner can do this.");
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }

    function acceptOwnership() public {
        require(msg.sender == newOwner, "Only new owner can accept.");
        emit OwnershipTransferred(currentOwner, newOwner);
        currentOwner = newOwner;
        newOwner = address(0);
    }
}

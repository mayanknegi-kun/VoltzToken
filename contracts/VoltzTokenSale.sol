pragma solidity ^0.5.0;

import "./VoltzToken.sol";

contract VoltzTokenSale{

    address admin;
    VoltzToken public tokenContract;
    uint256 public tokenPrice;

    constructor(VoltzToken _tokenContract,uint _tokenPrice) public{
        //assign admin
        admin = msg.sender;
        //add token Contract
        tokenContract = _tokenContract;
        //assign Token Price
        tokenPrice = _tokenPrice;
    }

}
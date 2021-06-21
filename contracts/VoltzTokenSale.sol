pragma solidity ^0.5.0;

import "./VoltzToken.sol";

contract VoltzTokenSale{

    address payable admin;
    VoltzToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer,uint256 _amount);

    constructor(VoltzToken _tokenContract,uint _tokenPrice) public{
        //assign admin
        admin = msg.sender;
        //add token Contract
        tokenContract = _tokenContract;
        //assign Token Price
        tokenPrice = _tokenPrice;
    }

    //safe multiply function
    function multiply(uint x,uint y) internal pure returns(uint z){
        require(y==0 || (z=x*y)/y==x);
    }

    function buyToken(uint256 _numberOfToken) public payable {
        require(msg.value == multiply(_numberOfToken,tokenPrice));
        // require contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfToken);
        // require that a transfer is succesful
        require(tokenContract.transfer(msg.sender,_numberOfToken));
        tokenSold += _numberOfToken; 
        emit Sell(msg.sender,_numberOfToken);
    }

    //ending sale
    function endSale() public {
        //require admin
        require(msg.sender==admin);
        //send remaining token to admin
        require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
        //destroy contract
        selfdestruct(admin);
    }

}
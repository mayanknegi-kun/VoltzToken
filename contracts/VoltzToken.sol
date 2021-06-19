pragma solidity ^0.5.0;

contract VoltzToken{
    string public name = "VoltzToken";
    string public symbol = "VLZ";
    string public standard = "Voltz Token v1.0";
    uint256 public totalSupply;
    mapping(address=>uint) public balanceOf;

    event Transfer(address indexed _from , address indexed _to,uint _value);

    //constructor
    constructor(uint _initialSupply) public{
        totalSupply = _initialSupply;
        //allocating initial supply
        balanceOf[msg.sender] = _initialSupply;
    }

    //transfer ERC20 standard
    function transfer(address _to, uint _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
pragma solidity ^0.5.0;

contract VoltzToken{
    string public name = "VoltzToken";
    string public symbol = "VLZ";
    string public standard = "Voltz Token v1.0";
    uint256 public totalSupply;
    mapping(address=>uint) public balanceOf;
    mapping(address=>mapping(address=>uint)) public allowance;

    event Transfer(address indexed _from , address indexed _to,uint _value);
    event Approval(address indexed _owner,address indexed _spender,uint _value);

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

    // Delegated Transfer

    // Account 'A' approve Account "B" to transfer on its behalf 
    function approve(address _spender,uint _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool success){
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] -= _value; 

        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}
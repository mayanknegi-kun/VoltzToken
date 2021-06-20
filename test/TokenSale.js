const { assert } = require("chai");

const VoltzTokenSale = artifacts.require("VoltzTokenSale");

contract("VoltzTokenSale",()=>{
    var tokenInstance;
    var tokenPrice = 100000000000000; //in wei

    it('initializes the contract with correct values',()=>{
        return VoltzTokenSale.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.address;
        }).then((address)=>{
            assert.notEqual(address,0x0,"has a contract address")
            return tokenInstance.tokenContract()
        }).then(address=>{
            assert.notEqual(address,0x0);
            return tokenInstance.tokenPrice();
        }).then(price=>{
            assert.equal(price,tokenPrice,"token price is correct");
        })
    })
})
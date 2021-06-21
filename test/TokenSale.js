const { assert } = require("chai");

const VoltzTokenSale = artifacts.require("VoltzTokenSale");
const VoltzToken = artifacts.require("VoltzToken");

contract("VoltzTokenSale",(accounts)=>{
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 100000000000000; //in wei
    var admin = accounts[0];
    var buyer = accounts[0];
    var tokenAvailable = 750000; 
    var numberOfTokens;
    it('initializes the contract with correct values',()=>{
        return VoltzTokenSale.deployed().then((instance)=>{
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then((address)=>{
            assert.notEqual(address,0x0,"has a contract address")
            return tokenSaleInstance.tokenContract()
        }).then(address=>{
            assert.notEqual(address,0x0);
            return tokenSaleInstance.tokenPrice();
        }).then(price=>{
            assert.equal(price,tokenPrice,"token price is correct");
        })
    })

    it("facilitates token buying",()=>{
        return VoltzToken.deployed().then(instance=>{
            tokenInstance = instance;
            return tokenInstance.deployed();
        }).then(instance=>{
            tokenSaleInstance = instance;
            //provision 75% of totalSupply
            return tokenInstance.tansfer(tokenSaleInstance.address,tokenAvailable,{from:admin})
        }).then(receipt=>{
            numberOfTokens = 10;
            return tokenSaleInstance.buyToken(numberOfTokens,{from:buyer,value:numberOfTokens*tokenPrice})
        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,"triggers one event");
            assert.equal(receipt.logs[0].event,"Sell","Should be Sell Event");
            assert.equal(receipt.logs[0].args._buyer,buyer,"logs the account the token are authorised by");
            assert.equal(receipt.logs[0].args._amount,numberOfTokens,"logs the transfer amount");
            return tokenSaleInstance.tokenSold();
        }).then(amount=>{
            assert.equal(amount.toNumber(),numberOfTokens,"increment the number of token sold");
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(balance=>{
            assert.equal(balance.toNumber(),tokenAvailable-numberOfTokens);
            return tokenSaleInstance.buyToken(numberOfTokens,{from:buyer,value:1})            
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,"msg.value must be equal number of token in wei")
            return tokenSaleInstance.buyToken(800000, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
          });

    });

    it('ends token sale', function() {
        return VoltzToken.deployed().then(function(instance) {
          // Grab token instance first
          tokenInstance = instance;
          return VoltzTokenSale.deployed();
        }).then(function(instance) {
          // Then grab token sale instance
          tokenSaleInstance = instance;
          // Try to end sale from account other than the admin
          return tokenSaleInstance.endSale({ from: buyer });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'must be admin to endSale');
          return tokenSaleInstance.endSale({ from: admin });

        })// End sale as admin
        .then(function(receipt) {
          return tokenInstance.balanceOf(admin);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 999990, 'returns all unsold Voltz tokens to admin');
          // Check that the contract has no balance
          balance = web3.eth.getBalance(tokenSaleInstance.address)
          assert.equal(balance.toNumber(), 0);
        });
      });
})
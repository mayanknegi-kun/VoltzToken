const { assert } = require("chai");

const VoltzToken = artifacts.require("VoltzToken");

contract("VoltzToken",accounts=>{
    var tokenInstance;

    it("initializes the contract with the correct values",()=>{
        return VoltzToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.name();
        }).then((name)=>{
            assert.equal(name,"VoltzToken");
            return tokenInstance.symbol();
        }).then(symbol=>{
            assert.equal(symbol,"VLZ");
            return tokenInstance.standard();
        }).then(standard=>{
            assert.equal(standard,"Voltz Token v1.0", "has correct standards")
        })
    })

    it("allocates the total supply upon deployment",()=>{
        return VoltzToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1000000");
            return tokenInstance.balanceOf(accounts[0])
        }).then((balance)=>{
            assert.equal(balance.toNumber(),1000000);
        });
    });

    it("transfer token ownership",()=>{
        return VoltzToken.deployed().then(instance=>{
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],9999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message, 'error message must contain revert');
            return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]})
        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event,"Transfer","should be transfer")
            return tokenInstance.balanceOf(accounts[1])
        }).then(balance=>{
            assert.equal(balance.toNumber(),250000,"adds the amount to reciever account")
            return tokenInstance.balanceOf(accounts[0])
        }).then(balance=>{
            assert.equal(balance.toNumber(),750000)
            return tokenInstance.transfer.call(accounts[1],25000,{from:accounts[0]});
        }).then(success=>{
            assert.equal(success,true,"successful transfer ")
        })
    })

    it("Approves tokens for delegated transfer",()=>{
        return VoltzToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1],100);
        }).then(success=>{
            assert.equal(success,true);
            return tokenInstance.approve(accounts[1],100);
        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,"triggers one event");
            assert.equal(receipt.logs[0].event,"Approval","Should be Approval Event");
            assert.equal(receipt.logs[0].args._owner,accounts[0],"logs the account the token are authorised by");
            assert.equal(receipt.logs[0].args._spender,accounts[1],"logs the account the token are authorised to");
            assert.equal(receipt.logs[0].args._value,100,"logs the transfer amount");
            return tokenInstance.allowance(accounts[0],accounts[1]);
        }).then(allowance=>{
            assert.equal(allowance.toNumber(),100,"stores the allowance for delegated transfer");
        })
    })

    it("handles delegate token transfer",()=>{
        return VoltzToken.deployed().then((instance)=>{
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];

            return tokenInstance.transfer(fromAccount,100,{from:accounts[0]});
        }).then(receipt=>{
            return tokenInstance.approve(spendingAccount,10,{from:fromAccount})
        }).then(receipt=>{
            return tokenInstance.transferFrom(fromAccount,toAccount,9999,{from:spendingAccount})
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than balance')
            return tokenInstance.transferFrom(fromAccount,toAccount,20,{from:spendingAccount})
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than approved amount')
            return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from:spendingAccount});
        }).then(success=>{
            assert.equal(success,true);
            return tokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount});
        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,"triggers one event");
            assert.equal(receipt.logs[0].event,"Transfer","Should be Transfer Event");
            assert.equal(receipt.logs[0].args._from,fromAccount,"logs the account the token are authorised by");
            assert.equal(receipt.logs[0].args._to,toAccount,"logs the account the token are authorised to");
            assert.equal(receipt.logs[0].args._value,10,"logs the transfer amount");
            return tokenInstance.balanceOf(fromAccount);
        }).then(balance=>{
            assert.equal(balance.toNumber(),90,"deducts the amount");
            return tokenInstance.balanceOf(toAccount);
        }).then(balance=>{
            assert.equal(balance.toNumber(),10,"adds balance to the recieving account")
            return tokenInstance.allowance(fromAccount,spendingAccount);
        })
    })
})
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
})
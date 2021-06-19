
const VoltzToken = artifacts.require("VoltzToken");

contract("VoltzToken",contract=>{
    it("sets the total supply upon deployment",()=>{
        return VoltzToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1000000");
        });
    });
})
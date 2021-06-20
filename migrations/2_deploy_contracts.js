const VoltzToken = artifacts.require("VoltzToken");
const VoltzTokenSale = artifacts.require("VoltzTokenSale");

module.exports = function (deployer) {
  deployer.deploy(VoltzToken,1000000).then(()=>{
    var tokenPrice = 100000000000000; //in wei
    return deployer.deploy(VoltzTokenSale,VoltzToken.address,tokenPrice); 
  });
};

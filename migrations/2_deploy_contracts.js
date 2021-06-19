const VoltzToken = artifacts.require("VoltzToken");

module.exports = function (deployer) {
  deployer.deploy(VoltzToken,1000000);
};

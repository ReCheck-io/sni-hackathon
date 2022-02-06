const Erc20Aqg = artifacts.require("Erc20Aqg");
const AqgGuard = artifacts.require("AqgGuard");

module.exports = function (deployer, network, accounts) {
  return deployer.deploy(Erc20Aqg).then(() => {
    return deployer
      .deploy(AqgGuard, Erc20Aqg.address, accounts[1])
      .then(async () => {
        (await Erc20Aqg.deployed()).transfer(AqgGuard.address, 1000000000);
        return;
      });
  });
};

var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Bolacha', 'Biscoito'], { gas: 6700000 });
};

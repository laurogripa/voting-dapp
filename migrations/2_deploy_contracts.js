var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Daniel', 'Peixinho'], { gas: 6700000 });
};

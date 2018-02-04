var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, 100, web3.toWei(0.000001, 'ether'), ['Hendrix', 'Slash', 'Chimbinha']);
};

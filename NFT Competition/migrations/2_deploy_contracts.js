const NFTMinter = artifacts.require("NFTMinter");
const Voting = artifacts.require("Voting");

module.exports = function(deployer, accounts) {
    deployer.deploy(NFTMinter, "SC", "SC")
    .then(function() {
        return deployer.deploy(Voting, NFTMinter.address);
    });
}
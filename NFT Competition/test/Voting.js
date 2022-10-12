const truffleAssert = require('truffle-assertions');

const Voting = artifacts.require("Voting");
const NFTMinter = artifacts.require("NFTMinter");

contract("Voting test", async accounts => {

  beforeEach(async () => {
    voting = await Voting.deployed();
    nftMinter = await NFTMinter.deployed();
  })
  let owner = accounts[0];
  let artist = accounts[1];
  let voter = accounts[2];
  let artist2 = accounts[3];
  let artist3 = accounts[4];
  
  it("Owner is defined", async () => {
    await voting.admin()
      .then((admin) => {
        assert.equal(admin, owner, "Wrong admin");
      })
  });

  it("Only owner can start a voting session", async() => {
    await truffleAssert.reverts(voting.createVotingSession(1000, 1, {from: artist}));
  })
  
  it("Owner can start a voting session", async() => {
    await voting.createVotingSession(1000, 1)
    .then(async () => {
      await voting.votingSessionIndex()
      .then((index) => {
        assert.equal(index, 1, "Not Working");
      })
    })
  })

  it("Can't open a voting session when one already exists", async() => {
    await truffleAssert.reverts(voting.createVotingSession(1000, 1));
  }) 

  it("Can submit NFT", async() => {
    await nftMinter.mint(artist, "coucou", "coucou", {from: artist})
    .then(async () => {
      await nftMinter.setApprovalForAll(voting.address, true, {from: artist});
    })
    .then(async() => {
      await voting.submitNFT(0, {from: artist});
    })
    .then(async() => {
      await nftMinter.mint(artist2, "coucou", "coucou", {from: artist2})
      .then(async() => {
        await nftMinter.setApprovalForAll(voting.address, true, {from: artist2})
        .then(async() => {
          await voting.submitNFT(1, {from: artist2})
        })
      })  
    })
    .then(async() => {
      await nftMinter.mint(artist3, "coucou", "coucou", {from: artist3})
      .then(async() => {
        await nftMinter.setApprovalForAll(voting.address, true, {from: artist3})
        .then(async() => {
          await voting.submitNFT(2, {from: artist3})
        })
      })  
    })
    .then(async () => {
      await nftMinter.balanceOf(voting.address)
      .then((result) => {
        assert.equal(result, 3, "Not Working");
      })
    })
  })

  it("Artist can submit only one NFT", async() => {
    await nftMinter.mint(artist, "coucou", "coucou", {from: artist})
    .then(async() => {
      nftMinter.setApprovalForAll(voting.address, true, {from: artist});
    })
    .then(async() => {
      await truffleAssert.reverts(voting.submitNFT(4, {from: artist}));
    })
  })

  it("Voters can't vote before vote is open", async() => {
    await truffleAssert.reverts(voting.voteForArtist(artist, {from: voter}))
  })

  it("Voters can't make donation before vote has open", async() => {
    await truffleAssert.reverts(voting.donation(artist, {from: voter, value: 1000}));
  })

  it("Only owner can open the vote", async() => {
    await truffleAssert.reverts(voting.openVote({from: artist}));
  })

  it("Owner can open the vote", async() => {
    await voting.openVote()
    .then(async () => {
      await voting.votingSessions(1)
      .then((result) => {
        assert.equal(result[2], true, "Not Working");
      })
    })
  })

  it("Can't submit NFT once the voting session has started", async() => {
    await voting.openVote()
    .then(async () => {
      await nftMinter.mint(artist, "coucou", "coucou", {from: artist})
      .then(async () => {
        await nftMinter.setApprovalForAll(voting.address, true, {from: artist});
      })
      .then(async() => {
        await truffleAssert.reverts(voting.submitNFT(5, {from: artist}));
      })
    })
  })

  it("Voters can vote", async() => {
    await voting.voteForArtist(artist, {from: voter, value: 1000})
    .then(async() => {
      await voting.voteForArtist(artist, {from: voter, value: 1000})
    })
    .then(async() => {
      await voting.voteForArtist(artist2, {from: voter, value: 1000})
    })
    .then(async () => {
      await voting.getVote(artist)
      .then((result) => {
        assert.equal(result, 2, "Not Working")
      })
    })
  })

  it("Voters can perform donation", async() => {
    await web3.eth.getBalance(artist)
    .then(async (balance) => {
      await voting.donation(artist, {from: voter, value: 1000000000000000000})
      .then(async () => {
        let newBalance = await web3.eth.getBalance(artist);
        let expectedBalance = parseInt(balance) + 1000000000000000000
        assert.equal(newBalance, expectedBalance, "Not Working");
      })
    })
  })


  it("Only owner can end voting session", async() => {
    await truffleAssert.reverts(voting.endVotingSession({from: artist}));
  }) 

  it("Owner can end voting session", async() => {
    await voting.endVotingSession()
    .then(async() => {
      nftMinter.balanceOf(voting.address)
      .then((result) => {
        assert.equal(result, 0, "Not Working")
      })
    })
  })

  it("Only owner can change owner", async() => {
    await truffleAssert.reverts(voting.changeAdmin(accounts[1], {from: accounts[1]}));
  })

  it("Owner can change owner", async() => {
    await voting.changeAdmin(accounts[1])
    .then(async () => {
      await voting.admin()
      .then((admin) => {
        assert.equal(admin, accounts[1], "Not Working");
      })
    })
  })

  it("Admin can open new voting session", async() => {
    await voting.createVotingSession(1000, 1, {from: accounts[1]})
    .then(async () => {
      await voting.votingSessionIndex()
      .then((index) => {
        assert.equal(index, 2, "Not Working");
      })
    })
  })

  it("Admin can emergency end voting session", async() => {
    await nftMinter.mint(artist, "coucou", "coucou", {from: artist})
    .then(async() => {
      nftMinter.setApprovalForAll(voting.address, true, {from: artist});
    })
    .then(async() => {
      await voting.submitNFT(0, {from: artist});
    })
    .then(async() => {
      await voting.openVote({from: accounts[1]})
    })
    .then(async() => {
      await voting.emergencyEndVotingSession({from: accounts[1]})
    })
    .then(async() => {
      nftMinter.balanceOf(voting.address)
      .then((result) => {
        assert.equal(result, 0, "Not Working")
      })
    })
  })
});

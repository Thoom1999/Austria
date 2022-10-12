const truffleAssert = require('truffle-assertions');

const NFTMinter = artifacts.require("NFTMinter");

contract("NFTMinter test", async accounts => {
  let artist = accounts[1];
  beforeEach(async () => {
    nftMinter = await NFTMinter.deployed();
  })

  it("artist can mint NFT", async () => {
    await nftMinter.mint(artist, "image", "description")
    .then(async () => {
        let balanceOfArtist = await nftMinter.balanceOf(artist) 
        assert.equal(balanceOfArtist, 1, "Balance not right")
    })
  });

  it("can get NFT of artist", async () => {
    await nftMinter.mint(artist, "image2", "description2")
    .then(async () => {
      let listNFTArtist = await nftMinter.NFTsOfArtist(artist);
      assert.equal((listNFTArtist.length), 2, "Not Working");
    })
  })

});
# Austria
Projects I made during my Erasmus mobility in Austria

## NFT Competition

Project done during smart contracts course at TUW. I did all the job alone and the deadline was quite short regarding the work I had in other courses. 

Thus there are errors and if you were to use it, <strong>I am not liable of any incidents that may happended to you using this code. </strong>

Especially, in the smart contracts there is at least : 
* Possible reentrancy for admins 
* One who submit the its NFT using a smart contract who can block ETH transfer and who wons one of the price can block the contract

Description
-----------
The project aims at making competing people own art as NFT. Competitors
have to put their NFT on the blockchain as NFT. They have then to submit
it on NFT COMPETITION. Once everyone, or enough pieces of art are
submitted, the Admin starts a voting session which will last a certain amount
of time. Each vote will be worth a certain fixed amount of Ether. The top
three will shares all the Ether collected during the session vote. One can also
offer Ether to a content creator during the vote session.


Usage
-----

Anyone interacting with the front end should have metamask installed and it's lva chain account imported in metamask.

An artist has to: 
1. Connect his wallet to the frontend
1. Mint his work on the blockchain (accepted format svg, jpg, png)
1. Submit his work to the competitioin on the submit page before vote opens
1. Artist will get back his NFT once the competition os over with potential donation or price denpending his ranking

A user has to: 
1. Connect his wallet to the front
1. Vote for pieces of art (no limit to vote but votes are not free)
1. Make donation if seduced by a piece of art. Artist will be paid immediately in case of a donation.

The owner has to: 
1. Create a voting session
1. Opens vote once there are enough candidates who have submitted their pieces of art (>3)
1. After some predifined amount of time, ends voting session (should ensure that at least three people have differents amount of vote)

Nb: If not respected (limits of three explained just above), contracts won't work has intended

Implementation
--------------

Implementation of the front end use React template. The parts of the frontend dealing with the blockchain uses a redux stores is adapted from this [repository](https://github.com/HashLips/hashlips_nft_minting_dapp). 

To make it work, deploy the contracts on any Ethereum based channel (configure for Goerli but you can change it in the blockchainAction.js file), put also the SC address in blockchainAction.js and in Submit.js files. Also create a .env files with api keys to interact with pinata for storing the images associated to NFTs. 

The front is not optimized at all and quite ugly sometimes in terms of code as I did it in quite a hurry. 
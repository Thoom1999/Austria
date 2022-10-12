// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../interfaces/INFTMinter.sol";
import "../interfaces/IVoting.sol";

contract Voting is IVoting, Context, IERC721Receiver {
    using Counters for Counters.Counter;

    struct VotingSession {
        uint256 id;
        uint256 timeOfOpening;
        uint256 timeOfSession; // In seconds
        bool onProgress;
        bool finish;
        mapping(address => uint256) votes; // Number for an NFT but affiliate to the owner of the NFT
        mapping(address => bool) isParticipant;
        mapping(uint256 => address[]) votesPerAddress;
        mapping(address => uint256) nftOwner;
        address[] participants;
        uint256 votePrice;
        uint256 price;
        uint256 donation;
    }

    Counters.Counter public votingSessionIndex;
    address public admin; // We can also imagine implementing a list of admin instead of just one
    mapping(uint256 => VotingSession) public votingSessions;
    INFTMinter public minter;

    constructor(address minter_) {
        admin = _msgSender();
        minter = INFTMinter(minter_);
    }

    // Modifiers 

    modifier onlyAdmin() {
        require(_msgSender() == admin, "Only admin can perform this action");
        _;
    }

    modifier voteIsOpen() {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        require(
            v.onProgress == true,
            "Can only vote when voting session is open"
        );
        _;
    }

    modifier lastSessionIsClosed() {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        if (votingSessionIndex.current() != 0) {
            require(
                v.finish == true,
                "Should wait that previous session is closed"
            );
        }
        _;
    }

    function changeAdmin(address newAdmin) external override onlyAdmin {
        admin = newAdmin;
        emit ChangeAdmin(newAdmin);
    }

    function createVotingSession(uint256 votePrice, uint256 timeOfSession)
        external
        override
        onlyAdmin
        lastSessionIsClosed
    {
        votingSessionIndex.increment();
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        v.id = votingSessionIndex.current();
        v.timeOfOpening = block.timestamp;
        v.onProgress = false;
        v.finish = false;
        v.votePrice = votePrice;
        v.timeOfSession = timeOfSession;
        emit CreateVotingSession(votingSessionIndex.current(), votePrice);
    }

    function getParticipants()
        external
        view
        override
        returns (address[] memory)
    {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        return v.participants;
    }

    function getNftOwner(address owner)
        external
        view
        override
        returns (uint256)
    {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        return v.nftOwner[owner];
    }

    function getVote(address artist) external view override returns (uint256) {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        return v.votes[artist];
    }

    function openVote() external override onlyAdmin {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        v.onProgress = true;
        emit OpenVote(votingSessionIndex.current());
    }

    function calculateFirstSecondThird() internal returns (uint256[3] memory) {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        uint256 nbrParticipants = v.participants.length;
        uint256 firstVote;
        uint256 secondVote;
        uint256 thirdVote;
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (v.votes[v.participants[i]] >= firstVote) {
                firstVote = v.votes[v.participants[i]];
            }
            v.votesPerAddress[v.votes[v.participants[i]]].push(
                v.participants[i]
            );
            unchecked {
                i++;
            }
        }
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (
                v.votes[v.participants[i]] >= secondVote &&
                v.votes[v.participants[i]] < firstVote
            ) {
                secondVote = v.votes[v.participants[i]];
            }
            unchecked {
                i++;
            }
        }
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (
                v.votes[v.participants[i]] >= thirdVote &&
                v.votes[v.participants[i]] < secondVote
            ) {
                thirdVote = v.votes[v.participants[i]];
            }
            unchecked {
                i++;
            }
        }

        uint256[3] memory list = [firstVote, secondVote, thirdVote];
        return list;
    }

    function getFirstSecondThird(uint256 index)
        internal
        view
        returns (uint256[3] memory)
    {
        VotingSession storage v = votingSessions[index];
        uint256 nbrParticipants = v.participants.length;
        uint256 firstVote;
        uint256 secondVote;
        uint256 thirdVote;
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (v.votes[v.participants[i]] >= firstVote) {
                firstVote = v.votes[v.participants[i]];
            }
            unchecked {
                i++;
            }
        }
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (
                v.votes[v.participants[i]] >= secondVote &&
                v.votes[v.participants[i]] < firstVote
            ) {
                secondVote = v.votes[v.participants[i]];
            }
            unchecked {
                i++;
            }
        }
        for (uint256 i = 0; i < nbrParticipants; ) {
            if (
                v.votes[v.participants[i]] >= thirdVote &&
                v.votes[v.participants[i]] < secondVote
            ) {
                thirdVote = v.votes[v.participants[i]];
            }
            unchecked {
                i++;
            }
        }

        uint256[3] memory list = [firstVote, secondVote, thirdVote];
        return list;
    }

    function endVotingSession() external override onlyAdmin voteIsOpen {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        require(
            block.timestamp - v.timeOfOpening >= v.timeOfSession,
            "Delay of session is not finished"
        );
        v.onProgress = false;
        v.finish = true;
        uint256[3] memory list = calculateFirstSecondThird();
        sendReward(
            v.votesPerAddress[list[0]],
            v.votesPerAddress[list[1]],
            v.votesPerAddress[list[2]]
        );

        giveBackAllNFT();
        emit EndVotingSession(votingSessionIndex.current());
    }

    function emergencyEndVotingSession() external override onlyAdmin voteIsOpen {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        v.onProgress = false;
        v.finish = true;
        giveBackAllNFT();
        emit EndVotingSession(votingSessionIndex.current());
    }

    function sendToList(address[] memory list, uint256 amount) internal {
        uint256 lenList = list.length;
        if (lenList != 1) {
            uint256 rewardForEach = amount / lenList;
            for (uint256 i = 0; i < lenList; ) {
                payable(list[i]).call{value: rewardForEach}("");
                unchecked {
                    i++;
                }
            }
        } else {
            payable(list[0]).call{value: amount}("");
        }
    }
    // Here are two bugs identified but not corrected : 
    // - sendToList pays the reward to firsts seconds and 
    //   thirds but it can be blocked if someone use a SC to submit its NFT, wins, and blocks ETH transfer with a callback function
    // - sendReward is called in endVotingSession, but if admin submits NFT and wins, he can reenter the SC and get more ETH than he should
    function sendReward(
        address[] memory firsts,
        address[] memory secondss,
        address[] memory thirds
    ) internal {
        uint256 totalReward = address(this).balance;
        uint256 rewardForFirsts = totalReward / 2;
        uint256 rewardForSeconds = (3 * totalReward) / 10;
        uint256 rewardForThirds = totalReward -
            rewardForFirsts -
            rewardForSeconds;
        sendToList(firsts, rewardForFirsts);
        sendToList(secondss, rewardForSeconds);
        sendToList(thirds, rewardForThirds);
    }

    function voteForArtist(address artist)
        external
        payable
        override
        voteIsOpen
        returns (bool)
    {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        require(
            v.isParticipant[artist] == true,
            "You can vote only for a participant"
        );
        require(
            msg.value == v.votePrice * 1 wei,
            "Not enough ether for the vote"
        );
        (bool sent, ) = address(this).call{value: msg.value}("");
        if (sent) {
            v.price += msg.value;
        }
        v.votes[artist] += 1;
        emit Vote(_msgSender(), artist);
        return sent;
    }

    function donation(address artist)
        external
        payable
        override
        voteIsOpen
        returns (bool)
    {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        (bool sent, ) = artist.call{value: msg.value}("");
        if (sent) {
            v.donation += msg.value;
        }
        emit Donation(_msgSender(), artist);
        return sent;
    }

    function submitNFT(uint256 id) external override {
        address artist = _msgSender();
        require(minter.ownerOf(id) == artist, "Can only submit one's own NFT");
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        require(v.finish == false && v.onProgress == false);
        require(v.isParticipant[artist] == false, "Already participating");
        minter.safeTransferFrom(artist, address(this), id);
        v.nftOwner[artist] = id;
        v.isParticipant[artist] = true;
        v.participants.push(artist);
        emit SubmitNFT(artist, id);
    }

    function giveBackNFT(address owner) internal {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        uint256 id = v.nftOwner[owner];
        minter.safeTransferFrom(address(this), owner, id);
    }

    function giveBackAllNFT() internal onlyAdmin {
        VotingSession storage v = votingSessions[votingSessionIndex.current()];
        uint256 length = v.participants.length;
        for (uint256 i = 0; i < length; ) {
            giveBackNFT(v.participants[i]);
            unchecked {
                i++;
            }
        }
    }

    function getFirsts(uint256 index)
        external
        view
        override
        returns (address[] memory)
    {
        uint256[3] memory winners = getFirstSecondThird(index);
        VotingSession storage v = votingSessions[index];
        return v.votesPerAddress[winners[0]];
    }

    function getSeconds(uint256 index)
        external
        view
        override
        returns (address[] memory)
    {
        uint256[3] memory winners = getFirstSecondThird(index);
        VotingSession storage v = votingSessions[index];
        return v.votesPerAddress[winners[1]];
    }

    function getThirds(uint256 index)
        external
        view
        override
        returns (address[] memory)
    {
        uint256[3] memory winners = getFirstSecondThird(index);
        VotingSession storage v = votingSessions[index];
        return v.votesPerAddress[winners[2]];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    receive() external payable {}
}

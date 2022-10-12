// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IVoting {
    event ChangeAdmin(address newAdmin);
    event CreateVotingSession(uint256 id, uint256 votingPrice);
    event OpenVote(uint256 id);
    event EndVotingSession(uint256 id);
    event Vote(address from, address artist);
    event Donation(address from, address artist);
    event SubmitNFT(address from, uint256 id);

    function changeAdmin(address newAdmin) external; 

    function createVotingSession(uint256 votePrice, uint256 timeOfSession) external;

    function getParticipants() external view returns (address[] memory);

    function getNftOwner(address owner) external view returns (uint256);

    function getVote(address artist) external view returns (uint256);

    function openVote() external;

    function endVotingSession() external;

    function emergencyEndVotingSession() external;

    function voteForArtist(address artist) external payable returns (bool);

    function donation(address artist) external payable returns (bool);

    function submitNFT(uint256 id) external;

    function getFirsts(uint256 index) external view returns (address[] memory);

    function getSeconds(uint256 index) external view returns (address[] memory);

    function getThirds(uint256 index) external view returns (address[] memory);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {

    uint public endDate;
    uint public voteCount;
    address public owner; 
    bool public votingEnded = false;
    address private winner;
    uint private winnerVotes;
    string public name;
    string public description;

    event ParticipantEntered(address participantAddress, string name, string description);
    event VoteCast(address voter, address participantAddress);
    event VotingStopped();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier onlyVotingActive() {
        require(!votingEnded, "Voting has been stopped");
        require(block.timestamp < endDate, "Voting period has ended");
        _;
    }

    struct Participant {
        address participantAddress;
        string name;
        string description;
    }

    Participant[] private participants;

    mapping (address => bool) public isParticipating;
    mapping (address => uint16) private votes; 

    mapping (address => bool) public hasVoted;

    constructor(address _owner, uint _time, string memory _name, string memory _description) {
        endDate = block.timestamp + _time;
        owner = _owner;
        name = _name;
        description = _description;
    }

    function stopVoting() public onlyOwner { 
        require(!votingEnded, "Voting has already been stopped");
        
        votingEnded = true;
        endDate = block.timestamp;
        emit VotingStopped();
    }

    /**
     * @notice Permet à un utilisateur de s'inscrire en tant que participant au concours.
     * @param _name Le nom du participant.
     * @param _description Une brève description du participant.
    */
    function enterCompetition(string memory _name, string memory _description) public {
        require(!isParticipating[msg.sender], "Already a participant");
        
        participants.push(Participant(msg.sender, _name, _description));
        isParticipating[msg.sender] = true;
        emit ParticipantEntered(msg.sender, _name, _description);
    }

    /**
     * @notice Permet à un utilisateur de voter pour un participant.
     * @param _participantAddress L'adresse du participant pour lequel l'utilisateur souhaite voter.
     * Les utilisateurs ne peuvent pas voter pour eux-mêmes et ne peuvent voter qu'une seule fois.
     * Le vote n'est possible que tant que le vote est actif.
     * Le gagnant est mis à jour automatiquement après chaque vote.
    */
    function vote(address _participantAddress) public onlyVotingActive {
        require(!hasVoted[msg.sender], "You have already voted");
        require(isParticipating[_participantAddress], "Invalid participant address");
        require(msg.sender != _participantAddress, "You cannot vote for yourself");
        
        votes[_participantAddress]++;
        hasVoted[msg.sender] = true;
        voteCount++;
        emit VoteCast(msg.sender, _participantAddress);

        if (votes[_participantAddress] > winnerVotes) {
            winnerVotes = votes[_participantAddress];
            winner = _participantAddress;
        }
    }

    function getVotes(address _participant) public view returns (uint16) {
        return votes[_participant];
    }

    function getWinner() public view returns (address, uint) {
        require(votingEnded || block.timestamp >= endDate, "Voting is still active");
        return (winner, winnerVotes);
    }

    function getParticipants() public view returns (Participant[] memory) {
        return participants;
    }
}
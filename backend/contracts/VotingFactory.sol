// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Voting.sol";
// trigger recompilation

contract VotingFactory {
    address[] public deployedVotings;

    // Un événement pour notifier la création d'un nouveau vote
    event VotingCreated(address indexed creator, address newVotingAddress, uint endDate);

    /**
     * @notice Permet à n'importe quel utilisateur de créer une nouvelle instance du contrat Voting.
     * @param _time La durée du vote en secondes.
     * @param _name Le nom du vote.
     * @param _description La description de ce pourquoi on vote.
     */
    function createVoting(uint _time, string memory _name, string memory _description) public {
        Voting newVoting = new Voting(msg.sender, _time, _name, _description);

        deployedVotings.push(address(newVoting));

        emit VotingCreated(msg.sender, address(newVoting), newVoting.endDate());
    }

    /**
     * @notice Retourne la liste de toutes les adresses de contrats Voting déployés.
     */
    function getDeployedVotings() public view returns (address[] memory) {
        return deployedVotings;
    }
}
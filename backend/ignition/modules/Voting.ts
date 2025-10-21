import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
  const voting = m.contract("Voting", [3600n]); // durée du vote (ex: 1h)
  const owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // adresse du propriétaire (ex: compte 0 de Hardhat)
  const participant1 = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; // adresse du participant 1 (ex: compte 1 de Hardhat)
  const participant2 = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"; // adresse du participant 2 (ex: compte 2 de Hardhat)
  const participant3 = "0x90f79bf6eb2c4f870365e785982e1f101e93b906"; // adresse du participant 3 (ex: compte 3 de Hardhat)

    m.call(voting, "enterCompetition", ["Alice", "Description for Alice"], { from: participant1 });
    m.call(voting, "enterCompetition", ["Bob", "Description for Bob"], { from: participant2, id: "enterBob" });
    
    m.call(voting, "vote", [participant2], { from: participant1, id: "voteForBob" });
    m.call(voting, "vote", [participant1], { from: participant2, id: "voteForAlice" });
    m.call(voting, "vote", [participant2], { from: participant3, id: "voteForBob2" });

    m.call(voting, "stopVoting", [], { from: owner });

    const getWinnerResult = m.staticCall(voting, "getWinner", []);

    return { getWinnerResult };

});
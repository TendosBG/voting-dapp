import hre from "hardhat";

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(3600); // durée du vote (ex: 1h)
  await voting.waitForDeployment();

  console.log(`Voting contract deployed at: ${await voting.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
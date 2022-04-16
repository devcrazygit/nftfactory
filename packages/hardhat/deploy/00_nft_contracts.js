// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async () => {
  const DgNftFactoryFactory = await ethers.getContractFactory("DgNftFactory");
  const [feeToSetter] = await ethers.getSigners();

  const DgNftFactory = await DgNftFactoryFactory.deploy(feeToSetter.address);
  await DgNftFactory.deployed();
  console.log("feeToSetter", feeToSetter.address);
  console.log("DgNftFactory", DgNftFactory.address);
};
module.exports.tags = ["DgNftFactory"];

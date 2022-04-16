const { ethers } = require("hardhat");
const { use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);
const MarketStatus = {
  NONE: 0,
  PRESALE: 1,
  SALE: 2,
  GIVEAWAY: 3,
};

let nftCreator;
let DgNft;

const baseTokenUri =
  "https://opensea-creatures-api.herokuapp.com/api/creature/";

const contractDeploy = async function () {
  const DgNftFactory = await ethers.getContractFactory("DgNft");
  [feeToSetter, feeTo, nftCreator, other] = await ethers.getSigners();

  DgNft = await DgNftFactory.deploy("dgnft", "DG - NFT", nftCreator.address);
  await DgNft.deployed();
};

describe("DgNftFactory", function () {
  beforeEach(async function () {
    await contractDeploy();
  });
  describe("when deployed first", function () {
    it("should initilize", async function () {
      const tx = await DgNft.initialize(
        [MarketStatus.PRESALE, MarketStatus.SALE, MarketStatus.GIVEAWAY],
        [100000000, 100000000, 100000000],
        baseTokenUri
      );
      const rc = await tx.wait();
      const event = rc.events.find((item) => item.event === "DgNftCreated");
      console.log({ event });
    });
  });
});

const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);
const MarketStatus = {
  NONE: 0,
  PRESALE: 1,
  SALE: 2,
  GIVEAWAY: 3,
};

const presalePrice = "10000000000000000";
const salePrice = "20000000000000000";
const giveawayPrice = "5000000000000000";

let feeToSetter;
let feeTo;
let nftCreator;
let other;
let DgNftFactory;

const baseTokenUri =
  "https://opensea-creatures-api.herokuapp.com/api/creature/";

const contractDeploy = async function () {
  const DgNftFactoryFactory = await ethers.getContractFactory("DgNftFactory");
  [feeToSetter, feeTo, nftCreator, other] = await ethers.getSigners();

  DgNftFactory = await DgNftFactoryFactory.deploy(feeToSetter.address);
  await DgNftFactory.deployed();
};

const createFactory = async function (name, symbol) {
  const tx = await DgNftFactory.connect(nftCreator).createNft(
    name,
    symbol,
    [MarketStatus.PRESALE, MarketStatus.SALE, MarketStatus.GIVEAWAY],
    [presalePrice, salePrice, giveawayPrice],
    baseTokenUri
  );
  const rc = await tx.wait();
  const event = rc.events.find((item) => item.event === "DgNftCreated");
  console.log({ event });
};

describe("DgNftFactory", function () {
  beforeEach(async function () {
    await contractDeploy();
  });
  describe("when deployed first", function () {
    it("should set the right feeToSetter", async function () {
      expect(await DgNftFactory.feeToSetter()).to.equal(feeToSetter.address);
    });
    it("should set feeTo", async function () {
      await expect(
        DgNftFactory.connect(other).setFeeTo(other.address)
      ).to.be.revertedWith("DgNftFactory: FORBIDDEN");
      await DgNftFactory.setFeeTo(feeTo.address);
      expect(await DgNftFactory.feeTo()).to.eq(feeTo.address);
    });
    it("should set feeToSetter", async function () {
      await expect(
        DgNftFactory.connect(other).setFeeToSetter(other.address)
      ).to.be.revertedWith("DgNftFactory: FORBIDDEN");
      await DgNftFactory.setFeeToSetter(other.address);
      expect(await DgNftFactory.feeToSetter()).to.eq(other.address);
      await expect(
        DgNftFactory.setFeeToSetter(other.address)
      ).to.be.revertedWith("DgNftFactory: FORBIDDEN");
    });
    it("should create dgNft", async () => {
      await createFactory("dgnft", "DG - NFT");
    });
  });
});

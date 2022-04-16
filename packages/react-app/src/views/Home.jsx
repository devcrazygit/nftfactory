import { Button } from "antd";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ address, readContracts, writeContracts}) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const totalCount = useContractReader(readContracts, "DgNftContract", "totalNftsOfOwner");
  const [marketPlaces, setMarketPlaces] = useState([]);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  const getNftMarketPlaces = useCallback(async () => {
    setMarketPlaces([]);
    for (let i = 0; i < totalCount; i++) {
      const item = await readContracts.DgNftFactory.nftAddressOfOwnerByIndex(address, i);
      setMarketPlaces(old => [...old, item]);
    }
  }, [address, readContracts.DgNftFactory, totalCount]);


  const [initial, setInitial] = useState(true);
  useEffect(() => {
    if (initial) {
      setInitial(false);
      getNftMarketPlaces();
    }
  }, [getNftMarketPlaces, initial]);

  const handleClick = useCallback(async () => {
    if (!name || !symbol) return;
    console.log(writeContracts);
    const tx = await writeContracts.DgNftFactory.createNft(
      name,
      symbol,
      [0, 1, 2],
      ["1000000000000000", "2000000000000000", "1000000000000"],
      "https://opensea-creatures-api.herokuapp.com/api/creature/"
    );
    const rc = await tx.wait();
    const event = rc.events.find(item => item.event === "DgNftCreated");
    console.log({ event });
    setInitial(true);
  }, [name, symbol, writeContracts.DgNftFactory]);

  return (
    <div>
      <div className="market-place-form">
        <div style={{margin: '20px'}}>
          <label>
            Name: <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div style={{margin: '20px'}}>
          <label>
            Symbol: <input type="text" value={symbol} onChange={e => setSymbol(e.target.value)} />
          </label>
        </div>
        <Button
          onClick={handleClick}
          size="large"
          shape="round"
        >
          Create
        </Button>
      </div>
      <div className="nft-contract-wrapper">
        <ul class="nft-contract">
          {marketPlaces.map((item, index) => (
            <li>
              <a href={`/markteplace/${item}`}>MarketPlace {index}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;

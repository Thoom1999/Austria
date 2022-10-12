import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import Address from './Address';
import { Button } from "react-bootstrap";

function MetaMaskButton() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    // const data = useSelector((state) => state.data);
  
    useEffect(() => {
      if (blockchain.account !== "" && blockchain.smartContract !== null) {
        dispatch(fetchData(blockchain.account));
      }
      console.log(blockchain.account);
    }, [blockchain, dispatch]);

    return(
        <>
            {
                blockchain.account == null ?
                    <Button className="button button-primary button-wide-mobile button-sm"
                        onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        }}>
                        Connect wallet
                    </Button> :
                    <Button className="button button-primary button-wide-mobile button-sm" >
                        <Address userAddress={blockchain.account}></Address>
                    </Button>
                }
        </>
    )
}

export default MetaMaskButton;
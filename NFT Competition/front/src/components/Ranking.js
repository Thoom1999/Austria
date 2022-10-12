import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Address from "./Address";

function Ranking(props) {

    const [donation, setDonation] = useState(0);
    const [price, setPrice] = useState(0);
    const blockchain = useSelector((state) => state.blockchain);
    const [firsts, setFirsts] = useState([]);
    const [seconds, setSeconds] = useState([]);
    const [thirds, setThirds] = useState([]);

    useEffect(() => {
        const getDonation = async () => {
            await blockchain.voting.votingSessions(props.sessionIndex)
            .then((result) => {
                const number = parseInt(result["donation"]["_hex"], 16) / 10**18;
                setDonation(number);
            })
        }

        const getPrice = async () => {
            await blockchain.voting.votingSessions(props.sessionIndex)
            .then((result) => {
                const number = parseInt(result["price"]["_hex"], 16) / 10**18;
                setPrice(number);
            })
        }

        const getFirst = async () => {
            await blockchain.voting.getFirsts(props.sessionIndex)
            .then((result) => {
                console.log(result);
                setFirsts(result);
            })
        }

        const getSecond = async () => {
            await blockchain.voting.getSeconds(props.sessionIndex)
            .then((result) => {
                console.log(result);
                setSeconds(result);
            })
        }

        const getThird = async () => {
            await blockchain.voting.getThirds(props.sessionIndex)
            .then((result) => {
                console.log(result);
                setThirds(result);
            })
        }
        
        getDonation();
        getPrice();
        getFirst();
        getSecond();
        getThird();
    }, [])

    return(
        <>
            <Card  style={{ width: "1000px"}} className="p-0">
                <Card.Title className="text-center">
                    <h2>Ranking of session {props.sessionIndex}</h2>
                </Card.Title>
                <Card.Body>
                        <div className="container d-flex flex-row justify-content-around">
                            <div className="">
                                <div style={{color: "#CD7F32"}}>
                                    Third
                                </div>
                                <ul>
                                    {thirds.map((artist, index) => {
                                        return <li key={index}><Address userAddress={artist}/></li>
                                    })}
                                </ul>
                            </div>
                            <div className="">
                                <div style={{color: "gold"}}>
                                    First
                                </div>
                                <ul>
                                    {firsts.map((artist, index) => {
                                        return <li key={index}><Address userAddress={artist}/></li>
                                    })}
                                </ul>
                            </div>
                            <div className="">
                                <div style={{color: "silver"}}>
                                    Second
                                </div>
                                <ul>
                                    {seconds.map((artist, index) => {
                                        return <li key={index}><Address userAddress={artist}/></li>
                                    })} 
                                </ul>
                            </div>
                        </div>
                </Card.Body>
                <Card.Footer className="text-center">
                    Donation: {donation} Ether, Price: {price} Ether
                </Card.Footer>
            </Card>
        </>
    )
}

export default Ranking;
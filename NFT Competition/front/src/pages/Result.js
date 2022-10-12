import Ranking from "../components/Ranking";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function Result() {

    const blockchain = useSelector((state) => state.blockchain);
    const [votingSessionId, setVotingSessionId] = useState([]);

    useEffect(() => {
        const getNbrOfVotingSession = async () => {
            await blockchain.voting.votingSessionIndex()
                .then((result) => {
                    const myList = []
                    for (let i = 1; i <= parseInt(result["_hex"], 16); i++) {
                        myList.push(parseInt(i, 16));
                    }
                    console.log("List: ", myList);
                    setVotingSessionId(myList);
                })
        }

        getNbrOfVotingSession();
    }, [])

    return (
        <>
            <div className="d-flex justify-content-center mt-5">
                {votingSessionId.map((id, index) => {
                    return <Ranking key={index} sessionIndex={id} />
                })
                }
            </div>
        </>
    )
}

export default Result;
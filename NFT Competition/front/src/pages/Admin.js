import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState } from "react";

function Admin() {

    const [voting, setVoting] = useState(0);

    const [time, setTime] = useState(0);

    const [adminAddress, setAdminAddress] = useState("");
    
    const blockchain = useSelector((state) => state.blockchain);

    const newSession = async () => {
       await blockchain.w_voting.createVotingSession(voting, time); 
    }

    const vote = async () => {
        await blockchain.w_voting.openVote();
    }

    const endSession = async () => {
        await blockchain.w_voting.endVotingSession();
    }

    const newAdmin  = async () => {
        await blockchain.w_voting.changeAdmin(adminAddress);
    }

    return(
        <>
            <div className="d-flex flex-column mt-5 mx-auto" style={{width: "10%"}}>
                <Button variant="primary" onClick={newSession}>New Voting session</Button>
                <input type="number" placeholder="Voting price" onChange={(e) => setVoting(e.target.value)} value={voting}/>
                <input type="number" placeholder="Time" onChange={(e) => setTime(e.target.value)} value={time}/>
                <br/>
                <Button variant="primary" onClick={vote}>Open Vote</Button>
                <Button variant="primary" onClick={endSession}>End voting session</Button>
                <Button variant="primary" onClick={newAdmin}>Change admin</Button>
                <input type="text" placeholder="New admin" onChange={(e) => setAdminAddress(e.target.value)} value={adminAddress}/>
            </div>
        </>
    )
}

export default Admin;
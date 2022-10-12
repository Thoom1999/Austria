import { Card } from "react-bootstrap";
import Address from "./Address";
import { useSelector } from "react-redux";
import ModalDonation from "./ModalDonation";
import { useState } from "react";

function VoteItem(props) {

    const baseURL = "https://gateway.pinata.cloud/ipfs/"

    const blockchain = useSelector((state) => state.blockchain);
    
    const voteFor = async () => {
        blockchain.voting.votingSessionIndex()
        .then( async (index) => {
            console.log(parseInt(index, 16));
            await blockchain.voting.votingSessions(index)
            .then( async (response) => {
                let votePrice = parseInt(response["votePrice"]["_hex"], 16);
                const options = {value: votePrice};
                await blockchain.w_voting.voteForArtist(props.address, options);
            })
        })
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const url = baseURL + props.image;

    return (
        <div className="mx-5 mt-5">
            <ModalDonation address={props.address} show={show} handleClose={handleClose}/>
            <Card style={{ width: '352px' }}>
                <Card.Img className="mx-auto" variant="top" src={url} width={350} height={350} />
                <Card.Body className="text-center">
                    <Card.Title>NFT of <Address userAddress={props.address}/></Card.Title>
                    <Card.Text>
                        {props.description}
                    </Card.Text>
                </Card.Body>
                <Card.Body className="d-flex m-auto">
                    <Card.Text className="mx-2" onClick={voteFor} style={{cursor: "pointer"}}>Vote</Card.Text>
                    <Card.Text className="mx-2" onClick={handleShow} style={{cursor: "pointer"}}>Donation</Card.Text>
                </Card.Body>
                <Card.Body>
                    <Card.Text>Number of vote: {props.vote}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default VoteItem;
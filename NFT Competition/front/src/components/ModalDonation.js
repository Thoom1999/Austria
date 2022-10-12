import { Modal, Form, Button } from "react-bootstrap";
import Address from "./Address";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useState } from "react";

function ModalDonation(props) {

    const blockchain = useSelector((state) => state.blockchain);

    const [amount, setAmount] = useState("0");

    const donation = async () => {
        const options = {value: ethers.utils.parseEther(amount)};
        console.log(ethers.utils.getAddress(props.address), options)
        await blockchain.w_voting.donation(ethers.utils.getAddress(props.address), options);
    }

    return(
        <>
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Donation to <Address userAddress={props.address}/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Amount of the donation (in ETH)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Donation"
                            autoFocus
                            onChange={e => setAmount(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={donation}>
                    Donation
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default ModalDonation;
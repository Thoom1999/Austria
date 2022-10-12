import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import DragAndDrop from "../components/DragAndDrop";
import axios from "axios";
import { useSelector } from "react-redux";

function Mint() {

    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState("");
    const [err, setErr] = useState(false);

    const blockchain = useSelector((state) => state.blockchain);

    const uploadFile = (f) => {
        setFile(f);
    }

    const reset = () => {
        setFile(null);
        setDescription("");
    }

    const uploadToIPFS = async () => {
        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        let data = new FormData();
        data.append('file', file);
        return await axios.post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data`,
                pinata_api_key: process.env.REACT_APP_API_KEY,
                pinata_secret_api_key: process.env.REACT_APP_API_KEY_SECRET
            }
        })
            .then(function (response) {
                console.log(response);
                setIpfsHash(String(response["data"]["IpfsHash"]));
                console.log("Done", ipfsHash);
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            })
    }

    const mint = async () => {
        uploadToIPFS().then(() => {
            console.log(blockchain.account, ipfsHash, description);
            if (ipfsHash === "") {
                setErr(true);
                return false;
            }
            blockchain.w_nftMinter.mint(blockchain.account, ipfsHash, description);
            setErr(false);
        });
    }

    return (
        <div className="text-center">
            <div className="h2 mt-2">Mint your NFT</div>
            <div className="d-flex justify-content-center mt-5">
                <Card style={{ width: "500px" }} className="p-0">
                    {file == null
                        ? <Card.Body className="text-center">
                            Drop your NFT here
                            <div className="dragAndDropZone">
                                <br />
                                <DragAndDrop uploadFile={uploadFile} />
                            </div>
                        </Card.Body>
                        : <>
                            <img className="mx-auto" src={URL.createObjectURL(file)} alt="" height="350px" width="350px" />
                            <br />
                            <div className="text-center">
                                <Button className="px-16" variant="primary" type="btn" onClick={reset}>
                                    Reset
                                </Button>
                            </div>
                        </>
                    }

                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" value={description} placeholder="Enter description" onChange={e => setDescription(e.target.value)} />
                            </Form.Group>
                        </Form>
                        <div className="text-center">
                            <Button variant="primary" type="btn" onClick={mint}>
                                Create NFT
                            </Button>
                        </div>
                        {err && <div className="text-danger mt-1">Something unexpected happened, please try again</div>}
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Mint;
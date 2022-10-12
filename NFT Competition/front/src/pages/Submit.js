import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import SubmitItem from "../components/SubmitItem";
import { useSelector } from "react-redux";

function Submit() {

    const [id, setId] = useState(-1);
    const [list, setList] = useState([]);
    const [nftLodaded, setNftLoaded] = useState(false);
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [approved, setApproved] = useState(false);
    const [err, setErr] = useState(false);

    const blockchain = useSelector((state) => state.blockchain);

    const baseURL = "https://gateway.pinata.cloud/ipfs/"

    useEffect(() => {
        const getNFT = async () => {
            let nbrOfNFT = await blockchain.nftMinter.balanceOf(blockchain.account);
            if (nbrOfNFT > 0) {
                setErr(false);
                let getNFT = await blockchain.nftMinter.NFTsOfArtist(blockchain.account);
                let listOfNft = [];
                getNFT.forEach(element => {
                    listOfNft.push(parseInt(element["_hex"], 16));
                });
                setList(listOfNft);
            }
            else {
                setErr(true);
            }
        }

        getNFT();
    }, [blockchain.account]);

    useEffect(() => {
        const isApproved = async () => {
            await blockchain.nftMinter.isApprovedForAll(blockchain.account, "PUT NFTMinter CONTRACT ADDRESS HERE")
            .then((result) => {
                console.log(result);
                if (result) {
                    setApproved(true);
                }
            })
        }

        isApproved();
    }, [approved])

    const handleId = (id) => {
        setId(id);
    }

    const imgUrl = (cid) => {
        return baseURL + cid;
    }

    const loadNFT = async () => {
        let result = await blockchain.nftMinter.nftMinters(id);
        console.log(result);
        setDescription(result["description"])
        setImage(imgUrl(result["image"]))
        setNftLoaded(true);
    }

    const approve = async () => {
        await blockchain.w_nftMinter.setApprovalForAll("PUT NFTMinter CONTRACT ADDRESS HERE", true)
        .then(() => {
            setApproved(true);
            console.log(approved);
        })
    }

    const submit = async () => {
        let result = await blockchain.w_voting.submitNFT(id)
        console.log(result);
    }

    return(
        <>
            <div className="text-center mt-1">
                <h2>Submit your NFT to the Competition</h2>
            </div>
            <div className="d-flex justify-content-center mt-5">
                <div style={{width: "500px"}}>
                    {err
                        ? <div className="text-center text-danger">
                            <p>You don't have any NFT to submit for the moment</p>
                        </div> 
                        :
                        <div className="text-center">
                            <select className="custom-select" value={id} onChange={(e) => handleId(e.target.value)}>
                                <option value="-1" selected>Select an NFT</option>
                                {list.map((element, index) => {
                                    return <option key={index} value={element}>{element}</option>
                                }
                                )}
                            </select>
                            <Button  variant="primary" type="btn" className="mx-2" onClick={loadNFT}>
                                Load NFT
                            </Button>
                        </div>
                    }
                </div>
            </div>
            <div className="d-flex justify-content-center">
                {nftLodaded === true
                ? <div className="d-flex flex-column">
                    <SubmitItem img={image} address={blockchain.account} description={description}/>
                    <div className="text-center mt-3">
                        {approved 
                        ? <Button  variant="primary" type="btn" className="mx-2" onClick={submit}>
                            Submit your NFT
                        </Button>
                        : <Button  variant="primary" type="btn" className="mx-2" onClick={approve}>
                            Approve your NFT
                        </Button>
                        }
                    </div>
                  </div>
                : <></>
                }
            </div>
        </>
    )
}

export default Submit;
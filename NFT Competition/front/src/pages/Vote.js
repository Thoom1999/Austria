import VoteItem from "../components/VoteItem";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Vote() {

    const blockchain = useSelector((state) => state.blockchain);
    const [votingStauts, setVotingStauts] = useState(true);
    const [voteItems, setVoteItems] = useState([]);

    useEffect(() => {
        const getVoteItems = async () => {
            let voteItems = [];
            const participants = await blockchain.voting.getParticipants();
            for ( const address of participants ) {
                let nftOfParticipant = await blockchain.voting.getNftOwner(address);
                let id = parseInt(nftOfParticipant, 16);
                let nft = await blockchain.nftMinter.nftMinters(id);
                let vote = await blockchain.voting.getVote(address);
                let nbrOfVote = parseInt(vote["_hex"], 16)
                let nftInfo = {
                    "address": address,
                    "description": nft["description"],
                    "image": nft["image"],
                    "vote": nbrOfVote
                };
                voteItems.push(nftInfo);
            }
            setVoteItems(voteItems);
            console.log("1", voteItems);
        }

        const getStatus = async () => { 
            await blockchain.voting.votingSessionIndex()
            .then(async (index) => {
                await blockchain.voting.votingSessions(index)
                .then((result) => {
                    if (result["onProgress"]) {
                        setVotingStauts(true);
                    }
                    else {
                        setVotingStauts(false);
                    }
                })
            })
        }

        getVoteItems();
        getStatus();

    }, [blockchain])

    return(
        <div className="text-center">  
            <div className="h2 mt-2">Vote for a NFT</div>
            {!votingStauts && <div className="text-danger">Vote is close for the moment</div>}
            <div className="d-flex flex-wrap justify-content-center">
                {voteItems.map((artist, index) => {
                    return <VoteItem key={index} address={artist["address"]} description={artist["description"]} image={artist["image"]} vote={artist["vote"]}/>
                })}
            </div>
        </div>
    )
}

export default Vote;
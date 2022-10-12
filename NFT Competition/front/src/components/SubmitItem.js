import { Card } from "react-bootstrap";
import Address from "./Address";

function SubmitItem(props) {
    return(
        <div className="mx-5 mt-5">
            <Card style={{ width: '352px' }}>
                <Card.Img className="mx-auto" variant="top" src={props.img} width={350} height={350} />
                <Card.Body className="text-center">
                    <Card.Title>NFT of <Address userAddress={props.address}/></Card.Title>
                    <Card.Text>
                        {props.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SubmitItem;
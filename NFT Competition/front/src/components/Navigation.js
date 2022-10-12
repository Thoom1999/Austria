import { Link } from "react-router-dom"
import { Navbar, Container, Nav } from "react-bootstrap"
import MetaMaskButton from "./MetaMaskButton";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Navigation() {

    const blockchain = useSelector((state) => state.blockchain);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getIsAdmin = async() => {
            const admin = await blockchain.voting.admin();
            const formatedAdmin = admin.toLowerCase();
            console.log("Admin: ", admin);
            console.log("Account: ", blockchain.account);
            if (blockchain.account === formatedAdmin) {
                setIsAdmin(true);
            }
            else {  
                setIsAdmin(false);
            }
            console.log("IsAdmin: ", isAdmin);
            console.log(typeof admin);
        }



        getIsAdmin();
    }, [blockchain])

    return(
        <>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand as={Link} to="/e12137112">
                        <h1>
                            NFTCompetition
                        </h1>
                    </Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link className="h3" as={Link} to="/e12137112">Vote</Nav.Link>
                    <Nav.Link className="h3" as={Link} to="/e12137112/mint">Mint</Nav.Link>
                    <Nav.Link className="h3" as={Link} to="/e12137112/submit">Submit</Nav.Link>
                    <Nav.Link className="h3" as={Link} to="/e12137112/result">Result</Nav.Link>
                    {
                        isAdmin ?
                        <Nav.Link className="h3" as={Link} to="/e12137112/admin">Admin</Nav.Link>
                        : null
                    }
                    </Nav>
                    <MetaMaskButton />
                </Container>
            </Navbar>
        </>
    )
}

export default Navigation;
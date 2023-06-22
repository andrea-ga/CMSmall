import { Card, CardGroup, Button } from 'react-bootstrap';
import {useContext, useEffect, useState} from "react";
import {getBlocks, getPubBlocks} from "./API.js";
import {Link} from "react-router-dom";
import UserContext from "./UserContext.js";

function PagesList(props) {
    const user = useContext(UserContext);

    return <div>
    <CardGroup>
        {props.pages.map((p) => (
            <Card key={p.id}>
                <Card.Body>
                    <Card.Title>TITLE: {p.title}</Card.Title>
                    <Card.Subtitle>User ID: {p.idUser}</Card.Subtitle>
                    <Card.Subtitle>Creation Date: {p.creationDate}</Card.Subtitle>
                    <Card.Subtitle>Publication Date: {p.publicationDate}</Card.Subtitle>
                    <Card.Text><PageDetails idPage={p.id} /></Card.Text>
                    <Card.Footer><Link to={`/pages/${p.id}`}>details...</Link></Card.Footer>
                    {user.id && <div><Card.Footer><Link to={`/pages/${p.id}/edit`}>Edit Page</Link></Card.Footer>
                        <Card.Footer><Link to={`/`}><Button onClick={() => props.handleDelete(p.id)}>Delete Page</Button></Link></Card.Footer></div>}
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
        {user.id && <Link to={`/pages/add`}>Add Page</Link>}
    </div>
}

function PageDetails(props) {
    const user = useContext(UserContext);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if(user.id) {
            getBlocks(props.idPage).then((list) => {
                setBlocks(list);
            })
        } else {
            getPubBlocks(props.idPage).then((list) => {
                setBlocks(list);
            })
        }
    }, [props, user]);

    return <CardGroup>
            {blocks.filter((b) => b.type === "paragraph").map((b) => (
            <Card key={b.id}>
                <Card.Body>
                    <Card.Title>{b.content}</Card.Title>
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
}

export { PagesList , PageDetails};
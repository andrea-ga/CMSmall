import { Card, CardGroup } from 'react-bootstrap';
import {useEffect, useState} from "react";
import {getBlocks} from "./API.js";
import {Link} from "react-router-dom";

function PagesList(props) {
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
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
        <Link to={`/pages/add`}>Add Page</Link>
    </div>
}

function PageDetails(props) {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getBlocks(props.idPage).then((list) => {
            setBlocks(list);
        })
    }, [props]);

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

export { PagesList };
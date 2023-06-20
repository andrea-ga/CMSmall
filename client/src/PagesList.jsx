import { Card, CardGroup, Button } from 'react-bootstrap';
import {useEffect, useState} from "react";
import {deletePage, getBlocks} from "./API.js";
import {Link} from "react-router-dom";

function PagesList(props) {
    async function handleDelete(idPage) {
        try {
            props.setPages((old) => old.filter((p) => p.id != idPage));

            await deletePage(idPage);
        } catch(error) {
            console.log(error);
        }
    }

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
                    <Card.Footer><Link to={`/pages/${p.id}/edit`}>Edit Page</Link></Card.Footer>
                    <Card.Footer><Link to={`/`}><Button onClick={() => handleDelete(p.id)}>Delete Page</Button></Link></Card.Footer>
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

export { PagesList , PageDetails};
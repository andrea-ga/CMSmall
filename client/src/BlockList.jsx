import {Card, CardGroup, Col, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getBlocks} from "./API.js";

function BlockList(props) {
    const {idPage} = useParams();

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setBlocks(list);
        })
    }, [idPage]);

    const page = props.pages.filter((p) => (p.id === Number(idPage)))[0];

    return <div>
        <PageInfo page={page} />
        <CardGroup>
        {blocks.sort((a,b) => (a.position - b.position)).map((b) => (
            <Card key={b.id}>
                <Card.Body>
                    <Card.Title>TYPE: {b.type}</Card.Title>
                    <Card.Subtitle>CONTENT: {b.content}</Card.Subtitle>
                    <Card.Subtitle>POSITION: {b.position}</Card.Subtitle>
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
    </div>
}

function PageInfo(props) {
    return <div>
        <Row>
            <Col md={8}>
                <h1>{props.page.title}</h1>
            </Col>
        </Row>
    </div>
}

export {BlockList};
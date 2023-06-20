import {Button, Card, CardGroup, Col, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteBlock, deletePage, getBlocks, updateBlock} from "./API.js";

function BlockList(props) {
    const {idPage} = useParams();

    const [blocks, setBlocks] = useState([]);
    const [waiting, setWaiting] = useState(true);

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setBlocks(list);
            setWaiting(false);
        })
    }, [idPage]);

    const page = props.pages.filter((p) => (p.id == idPage))[0];

    async function changePosUp(idBlock, type, content, position) {
        try {
            setWaiting(true);

            if(position !== 1) {
                setBlocks((old) => old.map(b => (b.position === position-1 ? {...b, position: b.position+1} : b)));
                for(const b of blocks)
                    if(b.position === position-1)
                        await updateBlock(b.idPage, b.id, b.type, b.content, b.position+1);

                setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position-1} : b)));
                await updateBlock(idPage, idBlock, type, content, position-1);
            }
        } catch(error) {
            console.log(error);
            setWaiting(false);
        } finally {
            setWaiting(false);
        }
    }

    async function changePosDown(idBlock, type, content, position) {
        try {
            setWaiting(true);

            if(position !== blocks.length) {
                setBlocks((old) => old.map(b => (b.position === position+1 ? {...b, position: b.position-1} : b)));
                for(const b of blocks)
                    if(b.position === position+1)
                        await updateBlock(b.idPage, b.id, b.type, b.content, b.position-1);

                setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position+1} : b)));
                await updateBlock(idPage, idBlock, type, content, position+1);
            }
        } catch(error) {
            console.log(error);
            setWaiting(false);
        } finally {
            setWaiting(false);
        }
    }

    async function handleDelete(idPage, idBlock) {
        try {
            setBlocks(blocks.filter((b) => b.id != idBlock && b.idPage == idPage));

            await deleteBlock(idPage, idBlock);
        } catch(error) {
            console.log(error);
        }
    }

    return <div>
        <PageInfo page={page} />
        <CardGroup>
        {blocks.sort((a,b) => (a.position - b.position)).map((b) => (
            <Card key={b.id}>
                <Card.Body>
                    <Card.Header><p onClick={() => {changePosUp(b.id, b.type, b.content, b.position)}}>↑</p></Card.Header>
                    <Card.Header><p onClick={() => {changePosDown(b.id, b.type, b.content, b.position)}}>↓</p></Card.Header>
                    <Card.Title>TYPE: {b.type}</Card.Title>
                    <Card.Subtitle>CONTENT: {b.content}</Card.Subtitle>
                    <Card.Subtitle>POSITION: {b.position}</Card.Subtitle>
                    <Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Button>EDIT BLOCK</Button></Link>
                    <Link to={`/pages/${idPage}`}><Button onClick={() => handleDelete(b.idPage, b.id)}>DELETE BLOCK</Button></Link>
                </Card.Body>
            </Card>
        ))}
            <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>
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

export {BlockList, PageInfo};
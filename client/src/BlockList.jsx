import {Button, Card, CardGroup, Col, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {deleteBlock, getBlocks, getPubBlocks, updateBlock} from "./API.js";
import UserContext from "./UserContext.js";
import circle from "../img/circle.png";
import point from "../img/point.png";
import phone from "../img/phone.png";

function BlockList(props) {
    const user = useContext(UserContext);
    const {idPage} = useParams();

    const [blocks, setBlocks] = useState([]);
    const [waiting, setWaiting] = useState(true);

    useEffect(() => {
        if(user.id) {
            getBlocks(idPage).then((list) => {
                setBlocks(list);
                setWaiting(false);
            })
        } else {
            getPubBlocks(idPage).then((list) => {
                setBlocks(list);
                setWaiting(false);
            })
        }
    }, [idPage, user]);

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
                    {user.id && <div><Card.Header><p onClick={() => {changePosUp(b.id, b.type, b.content, b.position)}}>↑</p></Card.Header>
                        <Card.Header><p onClick={() => {changePosDown(b.id, b.type, b.content, b.position)}}>↓</p></Card.Header></div>}
                    <Card.Title>TYPE: {b.type}</Card.Title>
                    {b.type === "image" && b.content === "circle" ? <Card.Subtitle><img src={circle} alt={b.content}/></Card.Subtitle> : ""}
                    {b.type === "image" && b.content === "point" ? <Card.Subtitle><img src={point} alt={b.content}/></Card.Subtitle> : ""}
                    {b.type === "image" && b.content === "phone" ? <Card.Subtitle><img src={phone} alt={b.content}/></Card.Subtitle> : ""}
                    {b.type !== "image" ? <Card.Subtitle>CONTENT: {b.content}</Card.Subtitle> : ""}
                    <Card.Subtitle>POSITION: {b.position}</Card.Subtitle>
                    {user.id && <div><Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Button>EDIT BLOCK</Button></Link>
                        <Link to={`/pages/${idPage}`}><Button onClick={() => handleDelete(b.idPage, b.id)}>DELETE BLOCK</Button></Link></div>}
                </Card.Body>
            </Card>
        ))}
            {user.id && <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>}
            <Link to={`/`}><Button>Go Back</Button></Link>
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
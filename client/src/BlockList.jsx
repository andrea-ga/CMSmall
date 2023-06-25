import {Button, Card, CardGroup, Col, Nav, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {deleteBlock, getBlocks, getPubBlocks, updateBlock} from "./API.js";
import UserContext from "./UserContext.js";
import star from "../img/star.png";
import circle from "../img/circle.png";
import point from "../img/point.png";
import phone from "../img/phone.png";

function BlockList(props) {
    const user = useContext(UserContext);
    const {idPage} = useParams();

    const [blocks, setBlocks] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        if(user.id) {
            getBlocks(idPage).then((list) => {
                setBlocks(list);
            });
        } else {
            getPubBlocks(idPage).then((list) => {
                setBlocks(list);
            });
        }
    }, [idPage, user]);

    const page = props.pages.filter((p) => (p.id == idPage))[0];

    async function changePosUp(idBlock, type, content, position) {
        if(position !== 1) {
            setBlocks((old) => old.map(b => (b.position === position-1 ? {...b, position: b.position+1} : b)));
            for(const b of blocks)
                if(b.position === position-1)
                    await updateBlock(b.idPage, b.id, b.type, b.content, b.position+1);

            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position-1} : b)));
            await updateBlock(idPage, idBlock, type, content, position-1);
        }
    }

    async function changePosDown(idBlock, type, content, position) {
        if(position !== blocks.length) {
            setBlocks((old) => old.map(b => (b.position === position+1 ? {...b, position: b.position-1} : b)));
            for(const b of blocks)
                if(b.position === position+1)
                    await updateBlock(b.idPage, b.id, b.type, b.content, b.position-1);

            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position+1} : b)));
            await updateBlock(idPage, idBlock, type, content, position+1);
        }
    }

    async function handleDelete(block) {
        const header = blocks.find((b) => b.id != block.id && b.type === "header");
        const parOrImg = blocks.find((b) => b.id != block.id && (b.type === "paragraph" || b.type === "image"));

        if(header && parOrImg) {
            const pos = block.position;
            setBlocks(blocks.filter((b) => b.id != block.id && b.idPage == block.idPage));
            setBlocks((old) => (old.map(b => b.position > pos  ? {...b, position: b.position-1} : b)));

            await deleteBlock(block.idPage, block.id);
        } else {
            setErrMsg("PAGE MUST HAVE AT LEAST ONE HEADER TOGETHER WITH A PARAGRAPH OR IMAGE");
        }
    }

    return <div>
        {errMsg && <p>{errMsg}</p>}
        <PageInfo page={page} />
        <br/>
        {(user.id == page.idUser || user.role === "admin") && <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>}
        <Link to={`/`}><Button>Go Back</Button></Link>
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => (
                <Card key={b.id}>
                    <Card.Header>
                        <Nav>
                            <Nav.Item>
                                <Card.Header><p>{b.type}</p></Card.Header>
                            </Nav.Item>
                            <Nav.Item>
                                <Card.Header><p>Position: {b.position}</p></Card.Header>
                            </Nav.Item>
                            <Nav.Item>
                                {(user.id == page.idUser || user.role === "admin") && <Card.Header><p onClick={() => {changePosUp(b.id, b.type, b.content, b.position)}}>↑</p></Card.Header>}
                            </Nav.Item>
                            <Nav.Item>
                                {(user.id == page.idUser || user.role === "admin") && <Card.Header><p onClick={() => {changePosDown(b.id, b.type, b.content, b.position)}}>↓</p></Card.Header>}
                            </Nav.Item>
                            <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                            <Nav.Item >
                                {(user.id == page.idUser || user.role === "admin") && <Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Card.Header><Button>EDIT BLOCK</Button></Card.Header></Link>}
                            </Nav.Item>
                            <Nav.Item>
                                {(user.id == page.idUser || user.role === "admin") && <Link to={`/pages/${idPage}`}><Card.Header><Button variant="danger" onClick={() => handleDelete(b)}>DELETE BLOCK</Button></Card.Header></Link>}
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        {b.type === "image" && b.content === "star" ? <Card.Subtitle><img src={star} alt={b.content}/></Card.Subtitle> : ""}
                        {b.type === "image" && b.content === "circle" ? <Card.Subtitle><img src={circle} alt={b.content}/></Card.Subtitle> : ""}
                        {b.type === "image" && b.content === "point" ? <Card.Subtitle><img src={point} alt={b.content}/></Card.Subtitle> : ""}
                        {b.type === "image" && b.content === "phone" ? <Card.Subtitle><img src={phone} alt={b.content}/></Card.Subtitle> : ""}
                        {b.type !== "image" ? <Card.Subtitle><p>{b.content}</p></Card.Subtitle> : ""}
                    </Card.Body>
                </Card>
            ))}
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
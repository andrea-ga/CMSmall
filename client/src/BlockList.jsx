import {Button, Card, Col, Form, Nav, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {addBlock, deleteBlock, getBlocks, getPubBlocks, updateBlock} from "./API.js";
import UserContext from "./UserContext.js";

function BlockList(props) {
    const user = useContext(UserContext);
    const {idPage} = useParams();

    const [type, setType] = useState(null);
    const [content, setContent] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [editModeId, setEditModeId] = useState(null);
    let lastId;

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

    async function handleAdd() {
        if (content !== null && content !== "") {
            await addBlock(idPage, type ? type : "header", content, blocks.length+1);

            getBlocks(idPage).then((list) => {
                setBlocks(list);
            });

            setErrMsg("");
        }
        else
            setErrMsg("CONTENT CAN'T BE EMPTY");
    }

    async function handleEdit(idBlock) {
        const header = (type === "header")
            || (type === null && blocks.find((b) => b.id == idBlock && b.type === "header"))
            || blocks.find((b) => b.id != idBlock && b.type === "header");
        const parOrImg = (type === "paragraph" || type === "image")
            || (type === null && blocks.find((b) => b.id == idBlock && (b.type === "paragraph" || b.type === "image")))
            || blocks.find((b) => b.id != idBlock && (b.type === "paragraph" || b.type === "image"));

        if(content === "") {
            setErrMsg("CONTENT CAN'T BE EMPTY");
        }
        else if(content === null && type === "image" && blocks.filter((b) => b.id == idBlock)[0].type !== "image") {
            setErrMsg("MUST SELECT AN IMAGE FROM THE LIST");
        }
        else if(header && parOrImg) {
            let newB = "";
            setBlocks(blocks.map(b => {
                if(b.id == idBlock && b.idPage == idPage) {
                    newB = b;

                    if(type !== null)
                        newB = {...newB, type: type};
                    if(content !== null)
                        newB = {...newB, content: content};

                    return newB;
                }
                else
                    return b;
            }));

            if(content !== null || type !== null)
                await updateBlock(idPage, idBlock, newB.type, newB.content, newB.position);

            setEditModeId(null);
        } else
            setErrMsg("PAGE MUST HAVE AT LEAST ONE HEADER TOGETHER WITH A PARAGRAPH OR IMAGE");
    }

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
            await deleteBlock(block.idPage, block.id, block.position);

            setBlocks((old) => old.map(b => (b.position > block.position ? {...b, position: b.position-1} : b)));
            setBlocks(blocks.filter((b) => b.id != block.id && b.idPage == block.idPage));

            getBlocks(idPage).then((list) => {
                setBlocks(list);
            });

            setErrMsg("");
        } else {
            setErrMsg("PAGE MUST HAVE AT LEAST ONE HEADER TOGETHER WITH A PARAGRAPH OR IMAGE");
        }
    }

    return <div>
        <Link to={`/`}><Button>GO BACK</Button></Link>
        <PageInfo page={page} />
        {(user.id == page.idUser || user.role === "admin") && <Card key={lastId+1}><div>
                <Form.Group controlId="addType">
                    <Form.Label className='fw-light'>Type</Form.Label>
                    <Form.Select aria-label="Type select" defaultValue="header" onChange={(ev) => (setType(ev.target.value))}>
                        <option value="header">Header</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="image">Image</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="addContent">
                    <Form.Label className='fw-light'>Content</Form.Label>
                    {type !== "image" ? <Form.Control as="textarea" aria-label="With textarea" name="content" placeholder="Enter Content" onChange={(ev) => {setContent(ev.target.value)}}></Form.Control> : ""}
                    {type === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => (setContent(ev.target.value))}>
                        <option>Select Image</option>
                        <option value="star">Star</option>
                        <option value="circle">Circle</option>
                        <option value="point">Point</option>
                        <option value="phone">Phone</option>
                    </Form.Select> : ""}
                </Form.Group>
                <br/>
                <Button onClick={handleAdd}>ADD NEW BLOCK</Button>
            </div></Card>}
        <br/>
        {errMsg && <p>{errMsg}</p>}
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => {
                lastId = b.id;
                if (editModeId !== null && b.id == editModeId && b.idPage == idPage) {
                    return <Card bg="info" key={b.id}>
                        <Card.Body>
                            <Form.Group controlId="addType">
                                <Form.Label className='fw-light'>Type</Form.Label>
                                <Form.Select aria-label="Type select" defaultValue={b.type}
                                             onChange={(ev) => (setType(ev.target.value))}>
                                    <option value="header">Header</option>
                                    <option value="paragraph">Paragraph</option>
                                    <option value="image">Image</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="addContent">
                                <Form.Label className='fw-light'>Content</Form.Label>
                                {((type !== "image" && type !== null) || (type === null && b.type !== "image")) ?
                                    <Form.Control type="text" name="content" defaultValue={b.content}
                                                  onChange={(ev) => (setContent(ev.target.value))}></Form.Control> : ""}
                                {(type === "image" || (type === null && b.type === "image")) ?
                                    <Form.Select aria-label="Image select" defaultValue={b.content}
                                                 onChange={(ev) => (setContent(ev.target.value))}>
                                        <option>Select Image</option>
                                        <option value="star">Star</option>
                                        <option value="circle">Circle</option>
                                        <option value="point">Point</option>
                                        <option value="phone">Phone</option>
                                    </Form.Select> : ""}
                            </Form.Group>
                            <Card.Footer><Button onClick={() => handleEdit(b.id)}>Update</Button>
                                <Button onClick={() => setEditModeId(null)}>Cancel</Button></Card.Footer>
                        </Card.Body>
                    </Card>
                } else {
                    return <div key={b.id}><Card>
                        <Card.Header>
                            <Nav>
                                <Nav.Item>
                                    <Card.Header><p>{b.type}</p></Card.Header>
                                </Nav.Item>
                                <Nav.Item>
                                    <Card.Header><p>Position: {b.position}</p></Card.Header>
                                </Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") &&
                                        <Card.Header><p onClick={() => {
                                            changePosUp(b.id, b.type, b.content, b.position)
                                        }}>↑</p></Card.Header>}
                                </Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") &&
                                        <Card.Header><p onClick={() => {
                                            changePosDown(b.id, b.type, b.content, b.position)
                                        }}>↓</p></Card.Header>}
                                </Nav.Item>
                                <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") &&
                                       <Card.Header><Button onClick={() => setEditModeId(b.id)}>EDIT BLOCK</Button></Card.Header>}
                                </Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") &&
                                        <Link to={`/pages/${idPage}`}><Card.Header><Button variant="danger"
                                                                                           onClick={() => handleDelete(b)}>DELETE
                                            BLOCK</Button></Card.Header></Link>}
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {b.type === "image" && b.content === "star" ?
                                <Card.Subtitle><img width="100" height="100" src='/img/star.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "circle" ?
                                <Card.Subtitle><img width="100" height="100" src='/img/circle.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "point" ?
                                <Card.Subtitle><img width="100" height="100" src='/img/point.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "phone" ?
                                <Card.Subtitle><img width="100" height="100" src='/img/phone.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type !== "image" ? <Card.Subtitle><p>{b.content}</p></Card.Subtitle> : ""}
                        </Card.Body>
                    </Card></div>
                }
            })}
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
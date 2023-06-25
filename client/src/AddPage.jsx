import {Button, Card, Col, Form, Nav, Row} from "react-bootstrap";
import {useContext, useState} from "react";
import UserContext from "./UserContext.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {addPage, getAllPages} from "./API.js";
import dayjs from "dayjs";

function AddPage(props) {
    const user = useContext(UserContext);
    const {state} = useLocation();
    const [blocks, setBlocks] = useState([{id: 1, type: "header", content: "", position:1}]);
    const [types, setTypes] = useState([]);
    const [contents, setContents] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [waiting, setWaiting] = useState(false);
    const navigate = useNavigate();

    async function handleAdd() {
        setWaiting(true);
        let headerFound = false;
        let parImgFound = false;
        let contentEmpty = false;

        for(const bl of blocks) {
            if(bl.type === "header") {
                headerFound = true;

                for(const bl2 of blocks) {
                    if(bl2.type === "paragraph" || bl2.type === "image") {
                        parImgFound = true;

                        for(const bl3 of blocks) {
                            if(bl3.content === "") {
                                setErrMsg("CONTENT IS EMPTY");
                                contentEmpty = true;
                                break;
                            }
                        }

                        if(!contentEmpty) {
                            await addPage(state.title, user.id, dayjs(), state.publicationDate, blocks);

                            getAllPages().then((list) => {
                                props.setPages(list);
                            });
                            navigate(`/`);
                        }
                    }

                    if(parImgFound)
                        break;
                }
            }

            if(headerFound)
                break;
        }

        if(!headerFound)
            setErrMsg("THERE'S NO HEADER");
        else if(!parImgFound)
            setErrMsg("THERE'S NO PARAGRAPH OR IMAGE");
        else
            setErrMsg("");

        setWaiting(false);
    }

    async function addMoreBlocks() {
        setWaiting(true);
        const bl = {id: blocks.length+1, type: "header", content: "", position: 1}
        blocks.push(bl);

        setBlocks(blocks);
        setBlocks((old) => old.map(b => (bl.id != b.id ? {...b, position: b.position+1} : b)));
        setErrMsg("");
        setWaiting(false);
    }

    async function handleUpdateType(ev, id) {
        types[id] = ev.target.value;
        setBlocks((old) => old.map(b => (b.id == id ? {...b, type: ev.target.value} : b)));
        setTypes(types);
    }

    async function handleUpdateContent(ev, id) {
        contents[id] = ev.target.value;
        setBlocks((old) => old.map(b => (b.id == id ? {...b, content: ev.target.value} : b)));
        setContents(contents);
    }

    async function changePosUp(idBlock, type, content, position) {
        setWaiting(true);
        if(position !== 1) {
            setBlocks((old) => old.map(b => (b.position === position-1 ? {...b, position: b.position+1} : b)));
            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position-1} : b)));
        }
        setErrMsg("");
        setWaiting(false);
    }

    async function changePosDown(idBlock, type, content, position) {
        setWaiting(true);
        if(position !== blocks.length) {
            setBlocks((old) => old.map(b => (b.position === position+1 ? {...b, position: b.position-1} : b)));
            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position+1} : b)));
        }
        setErrMsg("");
        setWaiting(false);
    }

    async function handleDelete(block) {
        setWaiting(true);

        const pos = block.position;

        setBlocks(blocks.filter((b) => b.id != block.id));
        setBlocks((old) => (old.map(b => b.position > pos ? {...b, position: b.position-1} : b)));
        types[block.id] = "header";
        setTypes(types);
        contents[block.id] = "";
        setContents(contents);
        setErrMsg("");

        setWaiting(false);
    }

    return <div>
        <div>
            <Row>
                <Col md={8}>
                    <h1>{state.title}</h1>
                </Col>
            </Row>
        </div>
        <br/>
            <Card><Button disabled={waiting} onClick={addMoreBlocks}>ADD MORE BLOCKS</Button></Card>
        <br/>
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => (
                <div key={b.id}><Card>
                     <Card.Header>
                         <Nav>
                             <Nav.Item>
                                 <Card.Header><p>position: {b.position}</p></Card.Header>
                             </Nav.Item>
                             <Nav.Item><Card.Header><Button disabled={waiting} onClick={() => {changePosUp(b.id, b.type, b.content, b.position)}}>↑</Button></Card.Header></Nav.Item>
                             <Nav.Item><Card.Header><Button disabled={waiting} onClick={() => {changePosDown(b.id, b.type, b.content, b.position)}}>↓</Button></Card.Header></Nav.Item>
                         </Nav>
                     </Card.Header>
                     <Card.Body>
                    <Form.Group controlId="addType">
                        <Form.Label className='fw-light'>Type</Form.Label>
                        <Form.Select aria-label="Type select" defaultValue="header" onChange={(ev) => {handleUpdateType(ev, b.id)}}>
                            <option value="header">Header</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="image">Image</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="addContent">
                        <Form.Label className='fw-light'>Content</Form.Label>
                        {types[b.id] !== "image" ? <Form.Control as="textarea" aria-label="With textarea" name="content" placeholder="Enter Content" onChange={(ev) => {handleUpdateContent(ev, b.id)}}></Form.Control> : ""}
                        {types[b.id] === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => {handleUpdateContent(ev, b.id)}}>
                            <option>Select Image</option>
                            <option value="star">Star</option>
                            <option value="circle">Circle</option>
                            <option value="point">Point</option>
                            <option value="phone">Phone</option>
                        </Form.Select> : ""}
                    </Form.Group>
                    </Card.Body>
                     <Button disabled={waiting} variant="danger" onClick={() => handleDelete(b)}>DELETE BLOCK</Button>
                </Card><br/></div>
            ))}
            {user.id && <Button disabled={waiting} onClick={handleAdd}>ADD PAGE</Button>}
            <Link to={`/`}><Button>CANCEL</Button></Link>
        {errMsg && <p>{errMsg}</p>}
    </div>
}

export {AddPage};

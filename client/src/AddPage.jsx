import {Button, Card, CardGroup, Col, Form, Row} from "react-bootstrap";
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
    const navigate = useNavigate();

    async function handleAdd() {
        try {
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
                setErrMsg("NON C'è HEADER");
            else if(!parImgFound)
                setErrMsg("NON C'è PARAGRAPH o IMAGE");
        } catch (error) {
            console.log(error);
        }
    }

    async function addMoreBlocks() {
        const bl = {id: blocks.length+1, type: "header", content: "", position: 1}
        blocks.push(bl);

        setBlocks(blocks);
        setBlocks((old) => old.map(b => (bl.id != b.id ? {...b, position: b.position+1} : b)));
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
        if(position !== 1) {
            setBlocks((old) => old.map(b => (b.position === position-1 ? {...b, position: b.position+1} : b)));
            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position-1} : b)));
        }
    }

    async function changePosDown(idBlock, type, content, position) {
        if(position !== blocks.length) {
            setBlocks((old) => old.map(b => (b.position === position+1 ? {...b, position: b.position-1} : b)));
            setBlocks((old) => old.map(b => (b.id === idBlock ? {...b, position: b.position+1} : b)));
        }
    }

    async function handleDelete(block) {
        const pos = block.position;

        setBlocks(blocks.filter((b) => b.id != block.id));
        setBlocks((old) => (old.map(b => b.position > pos ? {...b, position: b.position-1} : b)));
    }

    return <div>
        {errMsg && <p>{errMsg}</p>}
        <div>
            <Row>
                <Col md={8}>
                    <h1>{state.title}</h1>
                </Col>
            </Row>
        </div>
        <CardGroup>
            <Card><Button onClick={addMoreBlocks}>+</Button></Card>
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => (
                 <Card key={b.id}>
                    <Card.Body>
                        <div><Card.Header><p onClick={() => {changePosUp(b.id, b.type, b.content, b.position)}}>↑</p></Card.Header>
                            <Card.Header><p onClick={() => {changePosDown(b.id, b.type, b.content, b.position)}}>↓</p></Card.Header></div>
                    <Form.Group controlId="addType">
                        <Form.Label className='fw-light'>Type</Form.Label>
                        <Form.Select aria-label="Type select" onChange={(ev) => {handleUpdateType(ev, b.id)}}>
                            <option value="header">Header</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="image">Image</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="addContent">
                        <Form.Label className='fw-light'>Content</Form.Label>
                        {types[b.id] !== "image" ? <Form.Control type = "text" name="content" placeholder="Enter Content" onChange={(ev) => {handleUpdateContent(ev, b.id)}}></Form.Control> : ""}
                        {types[b.id] === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => {handleUpdateContent(ev, b.id)}}>
                            <option>Select Image</option>
                            <option value="star">Star</option>
                            <option value="circle">Circle</option>
                            <option value="point">Point</option>
                            <option value="phone">Phone</option>
                        </Form.Select> : ""}
                    </Form.Group>
                    </Card.Body>
                     <Button onClick={() => handleDelete(b)}>DELETE BLOCK</Button>
                </Card>
            ))}
            {user.id && <Button onClick={handleAdd}>ADD PAGE</Button>}
            <Link to={`/`}><Button>CANCEL</Button></Link>
        </CardGroup>
    </div>
}

export {AddPage};

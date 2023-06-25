import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {getBlocks, updateBlock} from "./API.js";
import {Button, Card, Form, Nav} from "react-bootstrap";
import {PageInfo} from "./BlockList.jsx";
import UserContext from "./UserContext.js";

function EditBlock(props) {
    const {idPage, idBlock} = useParams();
    const user = useContext(UserContext);

    const [type, setType] = useState(null);
    const [content, setContent] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setBlocks(list);
        })
    }, [idPage]);

    const page = props.pages.filter((p) => (p.id == idPage))[0];

    async function handleEdit() {
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

            navigate(`/pages/${idPage}`);
        } else
            setErrMsg("PAGE MUST HAVE AT LEAST ONE HEADER TOGETHER WITH A PARAGRAPH OR IMAGE");
    }

    return <div>
        {errMsg && <p>{errMsg}</p>}
        <PageInfo page={page} />
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => {
                if(b.id == idBlock && b.idPage == idPage) {
                    return <Card bg="info" key={b.id} >
                        <Card.Body>
                            <Form.Group controlId="addType">
                                <Form.Label className='fw-light'>Type</Form.Label>
                                <Form.Select aria-label="Type select" defaultValue={b.type} onChange={(ev) => (setType(ev.target.value))}>
                                    <option value="header">Header</option>
                                    <option value="paragraph">Paragraph</option>
                                    <option value="image">Image</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="addContent">
                                <Form.Label className='fw-light'>Content</Form.Label>
                                {((type !== "image" && type !== null) || (type === null && b.type !== "image"))  ? <Form.Control type = "text" name="content" defaultValue={b.content} onChange={(ev) => (setContent(ev.target.value))}></Form.Control> : ""}
                                {(type === "image" || (type === null && b.type === "image")) ? <Form.Select aria-label="Image select" defaultValue={b.content} onChange={(ev) => (setContent(ev.target.value))}>
                                    <option>Select Image</option>
                                    <option value="star">Star</option>
                                    <option value="circle">Circle</option>
                                    <option value="point">Point</option>
                                    <option value="phone">Phone</option>
                                </Form.Select> : ""}
                            </Form.Group>
                            <Card.Footer><Button onClick={handleEdit}>Update</Button>
                                <Link to={`/pages/${idPage}`}><Button>Cancel</Button></Link></Card.Footer>
                        </Card.Body>
                    </Card>
                } else {
                    return <Card key={b.id}>
                        <Card.Header>
                            <Nav>
                                <Nav.Item>
                                    <Card.Header><p>{b.type}</p></Card.Header>
                                </Nav.Item>
                                <Nav.Item>
                                    <Card.Header><p>Position: {b.position}</p></Card.Header>
                                </Nav.Item>
                                <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") && <Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Card.Header><Button>EDIT BLOCK</Button></Card.Header></Link>}
                                </Nav.Item>
                                <Nav.Item>
                                    {(user.id == page.idUser || user.role === "admin") && <Link to={`/pages/${idPage}`}><Card.Header><Button variant="danger" onClick={() => handleDelete(b)}>DELETE BLOCK</Button></Card.Header></Link>}
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {b.type === "image" && b.content === "star" ? <Card.Subtitle><img src='/img/star.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "circle" ? <Card.Subtitle><img src='/img/circle.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "point" ? <Card.Subtitle><img src='/img/point.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "phone" ? <Card.Subtitle><img src='/img/phone.png' alt={b.content}/></Card.Subtitle> : ""}
                            {b.type !== "image" ? <Card.Subtitle><p>{b.content}</p></Card.Subtitle> : ""}
                        </Card.Body>
                    </Card>
                }
            })}
        <br/>
            <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>
    </div>
}

export {EditBlock};

import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getBlocks, updateBlock} from "./API.js";
import {Button, Card, CardGroup, Form} from "react-bootstrap";
import {PageInfo} from "./BlockList.jsx";
import star from "../img/star.png";
import circle from "../img/circle.png";
import point from "../img/point.png";
import phone from "../img/phone.png";

function EditBlock(props) {
    const {idPage, idBlock} = useParams();

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
        <CardGroup>
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => {
                if(b.id == idBlock && b.idPage == idPage) {
                    return <Card key={b.id}>
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
                            <Card.Footer><Button onClick={handleEdit}>Update</Button></Card.Footer>
                            <Card.Footer><Link to={`/pages/${idPage}`}><Button>Cancel</Button></Link></Card.Footer>
                        </Card.Body>
                    </Card>
                } else {
                    return <Card key={b.id}>
                        <Card.Body>
                            <Card.Title>TYPE: {b.type}</Card.Title>
                            {b.type === "image" && b.content === "star" ? <Card.Subtitle><img src={star} alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "circle" ? <Card.Subtitle><img src={circle} alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "point" ? <Card.Subtitle><img src={point} alt={b.content}/></Card.Subtitle> : ""}
                            {b.type === "image" && b.content === "phone" ? <Card.Subtitle><img src={phone} alt={b.content}/></Card.Subtitle> : ""}
                            {b.type !== "image" ? <Card.Subtitle>CONTENT: {b.content}</Card.Subtitle> : ""}
                            <Card.Subtitle>POSITION: {b.position}</Card.Subtitle>
                            <Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Button>EDIT BLOCK</Button></Link>
                        </Card.Body>
                    </Card>
                }
            })}
            <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>
        </CardGroup>
    </div>
}

export {EditBlock};

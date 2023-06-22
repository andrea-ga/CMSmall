import {useContext, useEffect, useState} from "react";
import {addBlock, addPage, getAllPages, getBlocks} from "./API.js";
import {Button, Form} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import dayjs from "dayjs";
import UserContext from "./UserContext.js";

function AddBlockNew(props) {
    const user = useContext(UserContext);
    const [type1, setType1] = useState("header");
    const [content1, setContent1] = useState("");
    const [type2, setType2] = useState("header");
    const [content2, setContent2] = useState("");
    const [errMsg, setErrMsg] = useState('') ;
    const navigate = useNavigate();

    async function handleAdd() {
        try {
            if (type1 === "header" || type2 === "header") {
                if (type1 === "paragraph" || type1 === "image" || type2 === "paragraph" || type2 === "image") {
                    await addPage(props.title, user.id, dayjs(), props.publicationDate);

                    getAllPages().then((list) => {
                        props.setPages(list.sort((a,b) => (b.creationDate - a.creationDate)));
                    })

                    const pages = await getAllPages();
                    const idPage = pages.sort((a,b) => (b.id - a.id))[0].id;

                    await addBlock(idPage, type1, content1, 1);
                    await addBlock(idPage, type2, content2, 2);

                    navigate(`/pages/${idPage}`)
                } else {
                    setErrMsg("NON C'è PARAGRAPH o IMAGE");
                }
            } else {
                setErrMsg("NON C'è HEADER");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Form.Group controlId="addType">
            <Form.Label className='fw-light'>Type</Form.Label>
            <Form.Select aria-label="Type select" onChange={(ev) => (setType1(ev.target.value))}>
                <option value="header">Header</option>
                <option value="paragraph">Paragraph</option>
                <option value="image">Image</option>
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="addContent">
            <Form.Label className='fw-light'>Content</Form.Label>
            {type1 !== "image" ? <Form.Control type = "text" name="content" placeholder="Enter Content" onChange={(ev) => {setContent1(ev.target.value)}}></Form.Control> : ""}
            {type1 === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => (setContent1(ev.target.value))}>
                <option value="circle">Circle</option>
                <option value="point">Point</option>
                <option value="phone">Phone</option>
            </Form.Select> : ""}
        </Form.Group>
        <Form.Group controlId="addType">
            <Form.Label className='fw-light'>Type</Form.Label>
            <Form.Select aria-label="Type select" onChange={(ev) => (setType2(ev.target.value))}>
                <option value="header">Header</option>
                <option value="paragraph">Paragraph</option>
                <option value="image">Image</option>
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="addContent">
            <Form.Label className='fw-light'>Content</Form.Label>
            {type2 !== "image" ? <Form.Control type = "text" name="content" placeholder="Enter Content" onChange={(ev) => {setContent2(ev.target.value)}}></Form.Control> : ""}
            {type2 === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => (setContent2(ev.target.value))}>
                <option value="circle">Circle</option>
                <option value="point">Point</option>
                <option value="phone">Phone</option>
            </Form.Select> : ""}
        </Form.Group>
        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button>
            <Link to={`/`}><Button>CANCEL</Button></Link>
        </Form.Group>
        {errMsg}
    </div>
}

function AddBlock() {
    const {idPage} = useParams();
    const [type, setType] = useState("header");
    const [content, setContent] = useState("");
    const [position, setPosition] = useState("");

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setPosition(list.length+1);
        })
    }, [idPage]);

    async function handleAdd() {
        try {
            if (content !== "")
                await addBlock(idPage, type, content, position);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Form.Group controlId="addType">
            <Form.Label className='fw-light'>Type</Form.Label>
            <Form.Select aria-label="Type select" onChange={(ev) => (setType(ev.target.value))}>
                <option value="header">Header</option>
                <option value="paragraph">Paragraph</option>
                <option value="image">Image</option>
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="addContent">
            <Form.Label className='fw-light'>Content</Form.Label>
            {type !== "image" ? <Form.Control type = "text" name="content" placeholder="Enter Content" onChange={(ev) => {setContent(ev.target.value)}}></Form.Control> : ""}
            {type === "image" ? <Form.Select aria-label="Image select" onChange={(ev) => (setContent(ev.target.value))}>
                <option value="circle">Circle</option>
                <option value="point">Point</option>
                <option value="phone">Phone</option>
            </Form.Select> : ""}
        </Form.Group>
        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Link to={`/pages/${idPage}`}><Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button></Link>
            <Link to={`/pages/${idPage}`}><Button>CANCEL</Button></Link>
        </Form.Group>
    </div>
}

export { AddBlock, AddBlockNew };

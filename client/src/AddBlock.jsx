import {useEffect, useState} from "react";
import {addBlock, getBlocks} from "./API.js";
import {Button, Form} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";

function AddBlock() {
    const {idPage} = useParams();
    const [type, setType] = useState("header");
    const [content, setContent] = useState("");
    const [position, setPosition] = useState("");
    const [errMsg, setErrMsg] = useState('') ;
    const navigate = useNavigate();

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setPosition(list.length+1);
        })
    }, [idPage]);

    async function handleAdd() {
        if (content !== "") {
            await addBlock(idPage, type, content, position);
            navigate(`/pages/${idPage}`);
        }
        else
            setErrMsg("Content is empty");
    }

    return <div>
        {errMsg && <p>{errMsg}</p>}
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
                <option>Select Image</option>
                <option value="star">Star</option>
                <option value="circle">Circle</option>
                <option value="point">Point</option>
                <option value="phone">Phone</option>
            </Form.Select> : ""}
        </Form.Group>
        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button>
            <Link to={`/pages/${idPage}`}><Button>CANCEL</Button></Link>
        </Form.Group>
    </div>
}

export { AddBlock };

import {useEffect, useState} from "react";
import {addBlock, getBlocks} from "./API.js";
import {Button, Form} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";

function AddBlock() {
    const {idPage} = useParams();
    const [type, setType] = useState("");
    const [content, setContent] = useState("");
    const [position, setPosition] = useState("");

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setPosition(list.length+1);
        })
    }, [idPage]);

    async function handleAdd() {
        try {
            if (type !== "" && content !== "")
                await addBlock(idPage, type, content, position);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Form.Group controlId="addType">
            <Form.Label className='fw-light'>Type</Form.Label>
            <Form.Control type = "text" name="type" placeholder="Enter Type" onChange={(ev) => {setType(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addContent">
            <Form.Label className='fw-light'>Content</Form.Label>
            <Form.Control type = "text" name="content" placeholder="Enter Content" onChange={(ev) => {setContent(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Link to={`/pages/${idPage}`}><Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button></Link>
            <Link to={`/pages/${idPage}`}><Button>CANCEL</Button></Link>
        </Form.Group>
    </div>
}

export { AddBlock };

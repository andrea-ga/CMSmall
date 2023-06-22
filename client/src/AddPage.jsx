import {Form} from "react-bootstrap";
import {useState} from "react";
import {AddBlockNew} from "./AddBlock.jsx";

function AddPage(props) {
    const [title, setTitle] = useState("");
    const [publicationDate, setPublicationDate] = useState("");

    return <div>
        <Form.Group controlId="addTitle">
            <Form.Label className='fw-light'>Title</Form.Label>
            <Form.Control type = "text" name="text" placeholder="Enter Title" onChange={(ev) => {setTitle(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addPublicationDate">
            <Form.Label className='fw-light'>Publication Date</Form.Label>
            <Form.Control type = "date" name="publicationDate" placeholder="Enter Publication Date" onChange={(ev) => {setPublicationDate(ev.target.value)}}></Form.Control>
        </Form.Group>
        <AddBlockNew setPages={props.setPages} title={title} publicationDate={publicationDate} />
    </div>
}

export {AddPage};

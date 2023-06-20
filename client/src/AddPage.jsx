import {Form, Button} from "react-bootstrap";
import {useState} from "react";
import {addPage} from "./API.js";
import dayjs from "dayjs";
import {Link} from "react-router-dom";

function AddPage() {
    const [title, setTitle] = useState("");
    const [idUser, setIdUser] = useState("");
    const [creationDate, setCreationDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [publicationDate, setPublicationDate] = useState(dayjs().format('YYYY-MM-DD'));

    async function handleAdd() {
        try {
            if (title !== "" && idUser !== "")
                await addPage(title, idUser, creationDate, publicationDate);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Form.Group controlId="addTitle">
            <Form.Label className='fw-light'>Title</Form.Label>
            <Form.Control type = "text" name="text" placeholder="Enter Title" onChange={(ev) => {setTitle(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addAuthor">
            <Form.Label className='fw-light'>ID User</Form.Label>
            <Form.Control type = "text" name="text" placeholder="Enter ID User" onChange={(ev) => {setIdUser(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addCreationDate">
            <Form.Label className='fw-light'>Creation Date</Form.Label>
            <Form.Control type = "date" name="creationDate" placeholder="Enter Creation Date" onChange={(ev) => {setCreationDate(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addPublicationDate">
            <Form.Label className='fw-light'>Publication Date</Form.Label>
            <Form.Control type = "date" name="publicationDate" placeholder="Enter Publication Date" onChange={(ev) => {setPublicationDate(ev.target.value)}}></Form.Control>
        </Form.Group>
        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Link to={`/`}><Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button></Link>
            <Link to={`/`}><Button>CANCEL</Button></Link>
        </Form.Group>
    </div>
}

export {AddPage};

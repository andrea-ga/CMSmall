import {Form, Button} from "react-bootstrap";
import {useContext, useState} from "react";
import {addPage, getAllPages} from "./API.js";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import UserContext from "./UserContext.js";

function AddPage(props) {
    const user = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [publicationDate, setPublicationDate] = useState("");

    async function handleAdd() {
        try {
            if (title !== "") {
                await addPage(title, user.id, dayjs(), publicationDate);

                getAllPages().then((list) => {
                    props.setPages(list.sort((a,b) => (b.creationDate - a.creationDate)));
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Form.Group controlId="addTitle">
            <Form.Label className='fw-light'>Title</Form.Label>
            <Form.Control type = "text" name="text" placeholder="Enter Title" onChange={(ev) => {setTitle(ev.target.value)}}></Form.Control>
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

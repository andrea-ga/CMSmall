import {Button, Card, Form, Nav} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {GetAuthor, PageDetails} from "./PagesList.jsx";
import {getAllAuthors, updatePage} from "./API.js";
import {useContext, useEffect, useState} from "react";
import UserContext from "./UserContext.js";
import dayjs from "dayjs";

function EditPage(props) {
    const user = useContext(UserContext);
    const {idPage} = useParams();

    const [title, setTitle] = useState("");
    const [idUser, setIdUser] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    let lastId;

    async function handleEdit() {
        let newP = "";
        props.setPages((old) => old.map(p => {
            if(p.id == idPage) {
                newP = p;

                if(title !== "")
                    newP = {...newP, title: title};
                if(idUser !== "")
                    newP = {...newP, idUser: idUser};
                if(publicationDate !== "")
                    newP = {...newP, publicationDate: dayjs(publicationDate).format("YYYY-MM-DD")};

                return newP;
            }
            else
                return p;
        }));

        if(newP !== "")
            await updatePage(idPage, newP.title, newP.idUser, newP.creationDate, newP.publicationDate);
    }

    return <div>
        {user.id && <Card key={lastId+1}>
            <div>
                <Form.Group controlId="addTitle">
                    <Form.Label className='fw-light'>Title</Form.Label>
                    <Form.Control type = "text" name="text" placeholder="Enter Title" onChange={(ev) => {setTitle(ev.target.value)}}></Form.Control>
                </Form.Group>
                <Form.Group controlId="addPublicationDate">
                    <Form.Label className='fw-light'>Publication Date</Form.Label>
                    <Form.Control type = "date" name="publicationDate" placeholder="Enter Publication Date" onChange={(ev) => {setPublicationDate(ev.target.value)}}></Form.Control>
                </Form.Group>
                <Link to={`/pages/add`} state={{title: title, publicationDate: publicationDate}}><Button>Add New Page</Button></Link>
            </div>
        </Card>}
        <br/>
        {props.pages.sort((a,b) => (user.id ? (dayjs(a.creationDate).isAfter(dayjs(b.creationDate))) : (dayjs(a.publicationDate).isAfter(dayjs(b.publicationDate))))).map((p) => {
            lastId = p.id;

            if(p.id == idPage) {
                return <div key={p.id}>
                    <Card bg="info">
                        <Card.Header>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Form.Control type="text" defaultValue={p.title} onChange={(ev) => setTitle(ev.target.value)}></Form.Control>
                                </Nav.Item>
                                {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                    <Link to={`/`}><Button variant ="danger" onClick={() => props.handleDelete(p.id)}>Delete</Button></Link>
                                </Nav.Item>}
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <Card.Footer>{user.role === "admin" && <div><Form.Label>Author</Form.Label>
                                <GetAllAuthors idPage={p.id} setIdUser={setIdUser} /></div>}</Card.Footer>
                            <Card.Footer><Form.Label>Publication Date</Form.Label>
                                <Form.Control type="date" defaultValue={p.publicationDate} onChange={(ev) => setPublicationDate(ev.target.value)}></Form.Control></Card.Footer>
                            <Card.Footer><Link to={`/`}><Button onClick={handleEdit}>Update</Button></Link>
                                         <Link to={`/`}><Button>Cancel</Button></Link></Card.Footer>
                        </Card.Body>
                    </Card>
                    <br/></div>
            } else {
                return  <div key={p.id}>
                <Card>
                    <Card.Header>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Link to={`/pages/${p.id}`}><h3>{p.title}</h3></Link>
                            </Nav.Item>
                            <Nav.Item>

                            </Nav.Item>
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Link to={`/pages/${p.id}/edit`}><Button>Edit</Button></Link>
                            </Nav.Item>}
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Link to={`/`}><Button variant ="danger" onClick={() => props.handleDelete(p.id)}>Delete</Button></Link>
                            </Nav.Item>}
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text><PageDetails idPage={p.id}/></Card.Text>
                        <Card.Footer><GetAuthor idUser={p.idUser} /></Card.Footer>
                        <Card.Footer><p>Published: {p.publicationDate} Created: {p.creationDate}</p></Card.Footer>
                    </Card.Body>
                </Card>
                <br/></div>
            }
        }
        )}
    </div>
}

function GetAllAuthors(props) {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        getAllAuthors().then((users) => {
            setAuthors(users);
        })
    }, [props]);

    return <Form.Select aria-label="Author select" onChange={(ev) => (props.setIdUser(ev.target.value))}>
        <option>Select Author</option>
        {authors.map(a => (
            <option key={a.id} value={a.id}>{a.username}</option>
        ))}
    </Form.Select>
}

export {EditPage};

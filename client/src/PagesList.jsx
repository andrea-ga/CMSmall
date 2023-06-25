import {Card, CardGroup, Button, Form, Nav} from 'react-bootstrap';
import {useContext, useEffect, useState} from "react";
import {getBlocks, getPubBlocks, getUsername} from "./API.js";
import {Link} from "react-router-dom";
import UserContext from "./UserContext.js";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

function PagesList(props) {
    const user = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    let lastId;

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
                <br/>
                <Link to={`/pages/add`} state={{title: title, publicationDate: publicationDate}}><Button>Add New Page</Button></Link>
            </div>
        </Card>}
        <br/>
        {props.pages.sort((a,b) => (user.id ? (dayjs(a.creationDate).isAfter(dayjs(b.creationDate))) : (dayjs(a.publicationDate).isAfter(dayjs(b.publicationDate))))).map((p) => {
            lastId = p.id;

                return <div key={p.id}>
                    <Card>
                    <Card.Header>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Card.Header><Link to={`/pages/${p.id}`}><h3>{p.title}</h3></Link></Card.Header>
                            </Nav.Item>
                            <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Card.Header><Link to={`/pages/${p.id}/edit`}><Button>EDIT PAGE INFO</Button></Link></Card.Header>
                            </Nav.Item>}
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Card.Header><Link to={`/`}><Button variant ="danger" onClick={() => props.handleDelete(p.id)}>DELETE</Button></Link></Card.Header>
                            </Nav.Item>}
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text><PageDetails idPage={p.id}/></Card.Text>
                        <Card.Footer>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Card.Footer><GetAuthor idUser={p.idUser} /></Card.Footer>
                                </Nav.Item>

                                <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                                <Nav.Item>
                                    <Card.Footer><p>Created on: {p.creationDate}</p></Card.Footer>
                                </Nav.Item>
                                <Nav.Item>
                                    <Card.Footer><p>Published on: {p.publicationDate}</p></Card.Footer>
                                </Nav.Item>
                            </Nav>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            <br/></div>
            }
        )}
    </div>
}

function GetAuthor(props) {
    const [author, setAuthor] = useState([]);

    useEffect(() => {
        getUsername(props.idUser).then((row) => {
            setAuthor(row.username);
        })
    }, [props]);

    return <Card.Subtitle>Author: {author}</Card.Subtitle>
}

function PageDetails(props) {
    const user = useContext(UserContext);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if(user.id) {
            getBlocks(props.idPage).then((list) => {
                setBlocks(list);
            })
        } else {
            getPubBlocks(props.idPage).then((list) => {
                setBlocks(list);
            })
        }
    }, [props, user]);

    return <CardGroup>
            {blocks.filter((b) => b.position == 1).map((b) => (
            <Card key={b.id}>
                <Card.Body>
                    <Card.Title>{b.content}</Card.Title>
                    <Card.Subtitle>...........</Card.Subtitle>
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
}

export { PagesList , PageDetails, GetAuthor };
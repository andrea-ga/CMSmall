import {Card, CardGroup, Button, Form, Nav} from 'react-bootstrap';
import {useContext, useEffect, useState} from "react";
import {deletePage, getAllAuthors, getBlocks, getPubBlocks, getUsername, updatePage} from "./API.js";
import {Link} from "react-router-dom";
import UserContext from "./UserContext.js";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

function PagesList(props) {
    const user = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [idUser, setIdUser] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [editModeId, setEditModeId] = useState(null);
    const [waiting, setWaiting] = useState(false);
    let lastId;

    async function handleEdit(idPage) {
        setWaiting(true);
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

        setEditModeId(null);
        setWaiting(false);
    }

    async function handleDelete(idPage) {
        setWaiting(true);
        setPages((old) => old.filter((p) => p.id != idPage));

        await deletePage(idPage);
        setWaiting(false);
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
                <br/>
                <Link to={`/pages/add`} state={{title: title, publicationDate: publicationDate}}><Button disabled={waiting}>Add New Page</Button></Link>
            </div>
        </Card>}
        <br/>
        {props.pages.sort((a,b) => (user.id ? (dayjs(a.creationDate).isAfter(dayjs(b.creationDate))) : (dayjs(a.publicationDate).isAfter(dayjs(b.publicationDate))))).map((p) => {
            lastId = p.id;
            if(editModeId !== null && p.id == editModeId) {
                return <div key={p.id}>
                    <Card bg="info">
                        <Card.Header>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Form.Control type="text" defaultValue={p.title} onChange={(ev) => setTitle(ev.target.value)}></Form.Control>
                                </Nav.Item>
                                {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                    <Link to={`/`}><Button disabled={waiting} variant ="danger" onClick={() => handleDelete(p.id)}>DELETE</Button></Link>
                                </Nav.Item>}
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <Card.Footer>{user.role === "admin" && <div><Form.Label>Author</Form.Label>
                                <GetAllAuthors idPage={p.id} setIdUser={setIdUser} /></div>}</Card.Footer>
                            <Card.Footer><Form.Label>Publication Date</Form.Label>
                                <Form.Control type="date" defaultValue={p.publicationDate} onChange={(ev) => setPublicationDate(ev.target.value)}></Form.Control></Card.Footer>
                            <Card.Footer><Button disabled={waiting} onClick={() => handleEdit(p.id)}>UPDATE</Button>
                                <Button onClick={() => setEditModeId(null)}>CANCEL</Button></Card.Footer>
                        </Card.Body>
                    </Card>
                    <br/></div>
            } else {
                return <div key={p.id}>
                    <Card>
                    <Card.Header>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Card.Header><Link to={`/pages/${p.id}`}><h3>{p.title}</h3></Link></Card.Header>
                            </Nav.Item>
                            <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Card.Header><Button disabled={waiting} onClick={() => setEditModeId(p.id)}>EDIT PAGE INFO</Button></Card.Header>
                            </Nav.Item>}
                            {(user.id == p.idUser || user.role === "admin") && <Nav.Item>
                                <Card.Header><Link to={`/`}><Button disabled={waiting} variant ="danger" onClick={() => handleDelete(p.id)}>DELETE</Button></Link></Card.Header>
                            </Nav.Item>}
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text><PageDetails idPage={p.id}/></Card.Text>
                        <Link to={`/pages/${p.id}`}><Card.Subtitle><Button disabled={waiting}>SHOW PAGE</Button></Card.Subtitle></Link>
                        <br/>
                        <Card.Footer>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Card.Footer><GetAuthor idUser={p.idUser} /></Card.Footer>
                                </Nav.Item>

                                <Nav.Item class="navbar-nav me-auto mb-2 mb-lg-0"></Nav.Item>
                                <Nav.Item>
                                    <Card.Footer><p>Creation Date: {p.creationDate}</p></Card.Footer>
                                </Nav.Item>
                                <Nav.Item>
                                    <Card.Footer><p>Publication Date: {p.publicationDate}</p></Card.Footer>
                                </Nav.Item>
                            </Nav>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            <br/></div>
            }
        })}
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
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
}

export { PagesList , PageDetails, GetAuthor };
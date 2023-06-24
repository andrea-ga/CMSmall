import {Card, CardGroup, Button, Form} from 'react-bootstrap';
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
    <CardGroup>
        {props.pages.sort((a,b) => (user.id ? (dayjs(a.creationDate).isAfter(dayjs(b.creationDate))) : (dayjs(a.publicationDate).isAfter(dayjs(b.publicationDate))))).map((p) => {
            lastId = p.id;

                return <Card key={p.id}>
                    <Card.Body>
                        <Card.Title>TITLE: {p.title}</Card.Title>
                        <GetAuthor idUser={p.idUser} />
                        <Card.Subtitle>Creation Date: {p.creationDate}</Card.Subtitle>
                        <Card.Subtitle>Publication Date: {p.publicationDate}</Card.Subtitle>
                        <Card.Text><PageDetails idPage={p.id}/></Card.Text>
                        <Card.Footer><Link to={`/pages/${p.id}`}>details...</Link></Card.Footer>
                        {(user.id == p.idUser || user.role === "admin") && <div><Card.Footer><Link to={`/pages/${p.id}/edit`}>Edit Page Info</Link></Card.Footer>
                            <Card.Footer><Link to={`/`}><Button onClick={() => props.handleDelete(p.id)}>Delete
                                Page</Button></Link></Card.Footer></div>}
                    </Card.Body>
                </Card>
            }
        )}
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
                <Link to={`/pages/add`} state={{title: title, publicationDate: publicationDate}}><Button>ADD</Button></Link>
            </div>
        </Card>}
    </CardGroup>
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
            {blocks.filter((b) => b.type === "paragraph").map((b) => (
            <Card key={b.id}>
                <Card.Body>
                    <Card.Title>{b.content}</Card.Title>
                </Card.Body>
            </Card>
        ))}
    </CardGroup>
}

export { PagesList , PageDetails, GetAuthor };
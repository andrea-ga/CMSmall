import {Button, Card, CardGroup, Form} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {PageDetails} from "./PagesList.jsx";
import {updatePage} from "./API.js";
import {useState} from "react";

function EditPage(props) {
    const {idPage} = useParams();

    const [title, setTitle] = useState("");
    const [idUser, setIdUser] = useState("");
    const [publicationDate, setPublicationDate] = useState("");

    async function handleEdit() {
        try {
            let newP = "";
            props.setPages((old) => old.map(p => {
                if(p.id == idPage) {
                    newP = p;

                    if(title !== "")
                        newP = {...newP, title: title};
                    if(idUser !== "")
                        newP = {...newP, idUser: idUser};
                    if(publicationDate !== "")
                        newP = {...newP, publicationDate: publicationDate};

                    return newP;
                }
                else
                    return p;
            }));

            if(newP !== "")
                await updatePage(idPage, newP.title, newP.idUser, newP.creationDate, newP.publicationDate);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <CardGroup>
            {props.pages.map((p) => {
                if(p.id == idPage) {
                    return <Card key={p.id}>
                        <Card.Body>
                            <Form.Label>TITLE</Form.Label>
                            <Form.Control type="text" defaultValue={p.title} onChange={(ev) => setTitle(ev.target.value)}></Form.Control>
                            <Form.Label>ID USER</Form.Label>
                            <Form.Control type="text" defaultValue={p.idUser} onChange={(ev) => setIdUser(ev.target.value)}></Form.Control>
                            <Form.Label>Publication Date</Form.Label>
                            <Form.Control type="date" defaultValue={p.publicationDate} onChange={(ev) => setPublicationDate(ev.target.value)}></Form.Control>
                            <Card.Footer><Link to={`/`}><Button onClick={handleEdit}>Update</Button></Link></Card.Footer>
                            <Card.Footer><Link to={`/`}><Button>Cancel</Button></Link></Card.Footer>
                        </Card.Body>
                    </Card>
                } else {
                    return <Card key={p.id}>
                        <Card.Body><Card.Title>TITLE: {p.title}</Card.Title>
                        <Card.Subtitle>User ID: {p.idUser}</Card.Subtitle>
                        <Card.Subtitle>Creation Date: {p.creationDate}</Card.Subtitle>
                        <Card.Subtitle>Publication Date: {p.publicationDate}</Card.Subtitle>
                        <Card.Text><PageDetails idPage={p.id}/></Card.Text>
                        <Card.Footer><Link to={`/pages/${p.id}`}>details...</Link></Card.Footer>
                        <Card.Footer><Link to={`/pages/${p.id}/edit`}>Edit Page</Link></Card.Footer></Card.Body>
                    </Card>
                }
            })}
        </CardGroup>
        <Link to={`/pages/add`}>Add Page</Link>
    </div>
}

export {EditPage};

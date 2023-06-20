import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getBlocks, updateBlock} from "./API.js";
import {Button, Card, CardGroup, Form} from "react-bootstrap";
import {PageInfo} from "./BlockList.jsx";

function EditBlock(props) {
    const {idPage, idBlock} = useParams();

    const [type, setType] = useState("");
    const [content, setContent] = useState("");
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getBlocks(idPage).then((list) => {
            setBlocks(list);
        })
    }, [idPage]);

    const page = props.pages.filter((p) => (p.id == idPage))[0];

    async function handleEdit() {
        try {
            let newB = "";
            setBlocks(blocks.map(b => {
                if(b.id == idBlock && b.idPage == idPage) {
                    newB = b;

                    if(type !== "")
                        newB = {...newB, type: type};
                    if(content !== "")
                        newB = {...newB, content: content};

                    return newB;
                }
                else
                    return b;
            }));

            if(newB !== "")
                await updateBlock(idPage, idBlock, newB.type, newB.content, newB.position);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <PageInfo page={page} />
        <CardGroup>
            {blocks.sort((a,b) => (a.position - b.position)).map((b) => {
                if(b.id == idBlock && b.idPage == idPage) {
                    return <Card key={b.id}>
                        <Card.Body>
                            <Form.Label>TYPE</Form.Label>
                            <Form.Control type="text" defaultValue={b.type} onChange={(ev) => setType(ev.target.value)}></Form.Control>
                            <Form.Label>CONTENT</Form.Label>
                            <Form.Control type="text" defaultValue={b.content} onChange={(ev) => setContent(ev.target.value)}></Form.Control>
                            <Card.Footer><Link to={`/pages/${idPage}`}><Button onClick={handleEdit}>Update</Button></Link></Card.Footer>
                            <Card.Footer><Link to={`/pages/${idPage}`}><Button>Cancel</Button></Link></Card.Footer>
                        </Card.Body>
                    </Card>
                } else {
                    return <Card key={b.id}>
                        <Card.Body>
                            <Card.Title>TYPE: {b.type}</Card.Title>
                            <Card.Subtitle>CONTENT: {b.content}</Card.Subtitle>
                            <Card.Subtitle>POSITION: {b.position}</Card.Subtitle>
                            <Link to={`/pages/${idPage}/blocks/${b.id}/edit`}><Button>EDIT BLOCK</Button></Link>
                        </Card.Body>
                    </Card>
                }
            })}));
            <Link to={`/pages/${idPage}/blocks/add`}><Button>Add Block</Button></Link>
        </CardGroup>
    </div>
}

export {EditBlock};

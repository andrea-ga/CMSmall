import {Container, Navbar, Form, Button} from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import {getPages, getWebsiteName, updateWebsiteName} from './API';
import { PagesList } from "./PagesList";
import { BlockList } from "./BlockList.jsx";
import { AddPage } from "./AddPage.jsx";
import { EditPage } from "./EditPage.jsx";
import {AddBlock} from "./AddBlock.jsx";
import {EditBlock} from "./EditBlock.jsx";

function App() {
    const [pages, setPages] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        getPages().then((list) => {
            setPages(list);
        })

        getWebsiteName().then((name) => {
            setTitle(name.id);
        })
    }, []);

    async function handleChangeName() {
        try {
            await updateWebsiteName(title);
        } catch (error) {
            console.log(error);
        } finally {
            setEditMode(false);
        }
    }

    return <BrowserRouter>
        <Routes>
            <Route element={<MainLayout handleChangeName={handleChangeName} title={title} setTitle={setTitle} editMode={editMode} setEditMode={setEditMode} />}>
                <Route index element={<PagesList pages={pages} setPages={setPages} />} />
                <Route path='/pages/:idPage'
                       element={<BlockList pages={pages} />} />
                <Route path='/pages/add'
                       element={<AddPage />} />
                <Route path='/pages/:idPage/edit'
                       element={<EditPage pages={pages} setPages={setPages} />} />
                <Route path='/pages/:idPage/blocks/add'
                       element={<AddBlock />} />
                <Route path='/pages/:idPage/blocks/:idBlock/edit'
                       element={<EditBlock pages={pages}/>} />
            </Route>
        </Routes>
    </BrowserRouter>;
}

function MainLayout(props) {
    return <>
        <header>
            <Navbar sticky="top" variant='dark' bg="primary" expand="lg" className='mb-3'>
                <Container>
                    <Navbar.Brand>
                        {props.editMode ? <div><Form.Group><Form.Control defaultValue={props.title} onChange={(ev) => props.setTitle(ev.target.value)}></Form.Control></Form.Group>
                                <Link to={`/`} style={{color: 'white'}} onClick={props.handleChangeName}><Button>Update</Button></Link>
                                <Link to={`/`} style={{color: 'white'}} onClick={() => props.setEditMode(false)}><Button>Cancel</Button></Link></div>
                            : <div><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>{props.title}</Link>
                                <Link to={`/`} style={{color: 'white'}} onClick={() => props.setEditMode(true)}>Edit Name</Link></div>}
                    </Navbar.Brand>
                    <Navbar.Text>
                        Signed in as: Tom
                    </Navbar.Text>
                </Container>
            </Navbar>
        </header>
        <main>
            <Container>
                <Outlet />
            </Container>
        </main>

    </>
}

export default App

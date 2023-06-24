import {Container, Navbar, Form, Button} from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {useContext, useEffect, useState} from "react";
import {checkLogin, deletePage, doLogout, getAllPages, getPages, getWebsiteName, updateWebsiteName} from './API';
import { PagesList } from "./PagesList";
import { BlockList } from "./BlockList.jsx";
import { AddPage } from "./AddPage.jsx";
import { EditPage } from "./EditPage.jsx";
import { AddBlock } from "./AddBlock.jsx";
import { EditBlock } from "./EditBlock.jsx";
import { LoginForm } from "./Login.jsx";
import UserContext from "./UserContext.js";

function App() {
    const [pages, setPages] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("");
    const [user, setUser] = useState({}) ;

    const validateLogin = async (username, password) => {
        const user = await checkLogin(username, password) ;
        setUser(user) ;
    }

    const handleLogout = async () => {
        setEditMode(false);
        await doLogout() ;
        setUser({});
    }

    useEffect(() => {
        if(user.id) {
            getAllPages().then((list) => {
                setPages(list.sort((a,b) => (a.creationDate - b.creationDate)));
            })
        } else {
            getPages().then((list) => {
                setPages(list.sort((a,b) => (a.publicationDate - b.publicationDate)));
            })
        }

        getWebsiteName().then((name) => {
            setTitle(name.id);
        })
    }, [user]);

    async function handleChangeName() {
        try {
            await updateWebsiteName(title);
        } catch (error) {
            console.log(error);
        } finally {
            setEditMode(false);
        }
    }

    async function handleCancelChangeName() {
        try {
            const t = await getWebsiteName();
            setTitle(t.id);
        } catch (error) {
            console.log(error);
        } finally {
            setEditMode(false);
        }
    }

    async function handleDelete(idPage) {
        try {
            setPages((old) => old.filter((p) => p.id != idPage));

            await deletePage(idPage);
        } catch(error) {
            console.log(error);
        }
    }

    return <UserContext.Provider value={user}>
    <BrowserRouter>
        <Routes>
            <Route element={<MainLayout handleLogout={handleLogout} handleChangeName={handleChangeName} handleCancelChangeName={handleCancelChangeName} title={title} setTitle={setTitle} editMode={editMode} setEditMode={setEditMode} />}>
                <Route index element={<PagesList handleDelete={handleDelete} pages={pages} setPages={setPages} />} />
                <Route path='/login' element={<LoginForm validateLogin={validateLogin}/>}/>
                <Route path='/pages/:idPage'
                       element={<BlockList pages={pages} />} />
                <Route path='/pages/add'
                       element={<AddPage setPages={setPages} />} />
                <Route path='/pages/:idPage/edit'
                       element={<EditPage pages={pages} setPages={setPages} />} />
                <Route path='/pages/:idPage/blocks/add'
                       element={<AddBlock />} />
                <Route path='/pages/:idPage/blocks/:idBlock/edit'
                       element={<EditBlock pages={pages}/>} />
            </Route>
        </Routes>
    </BrowserRouter>
    </UserContext.Provider>;
}

function MainLayout(props) {
    const user = useContext(UserContext);
    return <>
        <header>
            <Navbar sticky="top" variant='dark' bg="primary" expand="lg" className='mb-3'>
                <Container>
                    <Navbar.Brand>
                        {user.role === "admin" ? <div>{props.editMode ? <div><Form.Group><Form.Control defaultValue={props.title} onChange={(ev) => props.setTitle(ev.target.value)}></Form.Control></Form.Group>
                                <Link to={`/`} style={{color: 'white'}} onClick={props.handleChangeName}><Button>Update</Button></Link>
                                <Link to={`/`} style={{color: 'white'}} onClick={props.handleCancelChangeName}><Button>Cancel</Button></Link></div>
                            : <div><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>{props.title}</Link>
                                <Link to={`/`} style={{color: 'white'}} onClick={() => props.setEditMode(true)}>Edit Name</Link></div>}</div>
                        : <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>{props.title}</Link>}
                    </Navbar.Brand>
                    <Navbar.Text>
                        {user.id ? <span>{user.username} <Link onClick={props.handleLogout}>Logout</Link></span>: <Link to='/login'>Login</Link>}
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

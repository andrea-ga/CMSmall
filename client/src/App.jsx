import {Container, Navbar, Form, Button} from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {useContext, useEffect, useState} from "react";
import {checkLogin, deletePage, doLogout, getAllPages, getPages, getWebsiteName, updateWebsiteName} from './API';
import { PagesList } from "./PagesList";
import { BlockList } from "./BlockList.jsx";
import { AddPage } from "./AddPage.jsx";
import { LoginForm } from "./Login.jsx";
import UserContext from "./UserContext.js";
import {PageNotFound} from "./PageNotFound.jsx";

function App() {
    const [pages, setPages] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(null);
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
                setPages(list);
            })
        } else {
            getPages().then((list) => {
                setPages(list);
            })
        }

        getWebsiteName().then((name) => {
            setTitle(name.id);
        })
    }, [user]);

    async function handleChangeName() {
        console.log(title);
        if(title !== null)
            await updateWebsiteName(title);

        setEditMode(false);
    }

    async function handleCancelChangeName() {
        const t = await getWebsiteName();
        setTitle(t.id);
        setEditMode(false);
    }

    async function handleDelete(idPage) {
        setPages((old) => old.filter((p) => p.id != idPage));

        await deletePage(idPage);
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
                <Route path='*' element={<PageNotFound />} />
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
                                : <div><Link to='/' style={{ color: 'white', textDecoration: 'none' }}><h4>{props.title}</h4></Link>
                                <Link to={`/`} style={{color: 'white'}} onClick={() => props.setEditMode(true)}>Edit Name</Link></div>}</div>
                            : <Link to='/' style={{ color: 'white', textDecoration: 'none' }}><h4>{props.title}</h4></Link>}
                    </Navbar.Brand>
                    <Navbar.Text>
                        {user.id ? <span>{user.username} <Link onClick={props.handleLogout}><Button variant="info">Logout</Button></Link></span>: <Link to='/login'><Button variant="info">Login</Button></Link>}
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

import { Container, Navbar } from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes, useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { getPages } from './API';
import { PagesList } from "./PagesList";
import { BlockList } from "./BlockList.jsx";
import { AddPage } from "./AddPage.jsx";

function App() {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        getPages().then((list) => {
            setPages(list);
        })
    }, []);

    return <BrowserRouter>
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<PagesList pages={pages} />} />
                <Route path='/pages/:idPage'
                       element={<BlockList pages={pages} />} />
                <Route path='/pages/add'
                       element={<AddPage />} />
            </Route>
        </Routes>
    </BrowserRouter>;
}

function MainLayout() {
    const { idQuestion } = useParams();
    return <>
        <header>
            <Navbar sticky="top" variant='dark' bg="primary" expand="lg" className='mb-3'>
                <Container>
                    <Navbar.Brand><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>CMSmall</Link> {idQuestion && <span>- Question {idQuestion}</span>} </Navbar.Brand>
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

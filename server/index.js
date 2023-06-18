'use strict';

const PORT = 3000;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

const pagesDao = require('./pages-dao');
const {Page, Block} = require('./cms');

app.get('/api/pages', (req, res) => {
    pagesDao.getAllPages().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.get('/api/pages/:idPage', (req, res) => {
    const idPage = req.params.idPage;

    pagesDao.getPageContent(idPage).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
}) ;

app.post('/api/pages', (req, res) => {
    const page = new Page(null, req.body.title, req.body.idUser, req.body.creationDate, req.body.publicationDate);
    pagesDao.createPage(page).then((result) => {
        res.end();
    }).catch((error) => {
        res.set('Content-Type: text/plain');
        res.status(500).send(error.message);
    });
});

app.post('/api/pages/:idPage', (req, res) => {
    const block = new Block(null, req.params.idPage, req.body.type, req.body.content, req.body.position);
    pagesDao.createBlock(block).then((result) => {
        res.end();
    }).catch((error) => {
        res.set('Content-Type: text/plain');
        res.status(500).send(error.message);
    });
});

app.delete('/api/pages/:idPage', (req, res) => {
    const idPage = req.params.idPage;
    pagesDao.deletePage(idPage).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.delete('/api/pages/:idPage/blocks/:idBlock', (req, res) => {
    const idPage = req.params.idPage;
    const idBlock = req.params.idBlock;
    pagesDao.deleteBlock(idPage, idBlock).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.put('/api/pages/:idPage', (req, res) => {
    const idPage = req.params.idPage;
    const page = new Page(null, req.body.title, req.body.idUser, req.body.creationDate.toISOString(), req.body.publicationDate.toISOString());
    pagesDao.updatePage(idPage, page).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.put('/api/pages/:idPage/blocks/:idBlock', (req, res) => {
    const idPage = req.params.idPage;
    const idBlock = req.params.idBlock;
    const block = new Block(null, req.body.idPage, req.body.type, req.body.content, req.body.position);
    pagesDao.updatePage(idPage, idBlock, block).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });
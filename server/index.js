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

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });
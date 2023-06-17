'use strict';

const {Page, Block} = require('./cms');

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

const db = require('./db');

function getAllPages() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const pages = rows.map(row => new Page(row.id, row.title, row.iduser, row.creationdate, row.publicationdate));
                resolve(pages);
            }
        });
    });
}

function getPageContent(idPage) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM blocks WHERE idpage = ?';
        db.all(sql, idPage, (err, rows) => {
            if (err)
                reject(err);
            else {
                const blocks = rows.map(row => new Block(row.id, row.idpage, row.type, row.content));
                resolve(blocks);
            }
        });
    });
}

exports.getAllPages = getAllPages;
exports.getPageContent = getPageContent;

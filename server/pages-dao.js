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

function createPage(page) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages(title, iduser, creationdate, publicationdate) VALUES (?,?,?,?)';
        db.run(sql, [page.title, page.idUser, page.creationDate.toISOString(), page.publicationDate.toISOString()]
            , (err) => {
                if(err)
                    reject(err);
                else
                    resolve(true);
            });
    });
}

function createBlock(block) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO blocks(idpage, type, content, position) VALUES (?,?,?,?)';
        db.run(sql, [block.idPage, block.type, block.content, block.position], (err) => {
                if(err)
                    reject(err);
                else
                    resolve(true);
            });
    });
}

exports.getAllPages = getAllPages;
exports.getPageContent = getPageContent;
exports.createPage = createPage;
exports.createBlock = createBlock;

'use strict';

const {Page, Block, Website} = require('./cms');
const db = require('./db');

function getWebsiteName() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM website';
        db.get(sql, (err, row) => {
            if(err)
                reject(err)
            else {
                const website = new Website(row.title);
                resolve(website);
            }
        })
    })
}

function updateWebsiteName(website) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE website SET title=? WHERE id=?';
        db.run(sql, [website.title, 1], (err, row) => {
            if(err)
                reject(err)
            else
                resolve(true);
        })
    })
}

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

function getPages() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE DATE() >= publicationDate';
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
                const blocks = rows.map(row => new Block(row.id, row.idpage, row.type, row.content, row.position));
                resolve(blocks);
            }
        });
    });
}

function getPubPageContent(idPage) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM blocks WHERE idpage = ? AND idpage IN (SELECT id FROM pages WHERE DATE() >= publicationDate)';
        db.all(sql, idPage, (err, rows) => {
            if (err)
                reject(err);
            else {
                const blocks = rows.map(row => new Block(row.id, row.idpage, row.type, row.content, row.position));
                resolve(blocks);
            }
        });
    });
}

function createPage(page) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages(title, iduser, creationdate, publicationdate) VALUES (?,?,?,?)';
        db.run(sql, [page.title, page.idUser, page.creationDate, page.publicationDate ?  page.publicationDate : null]
            , (err) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
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

function deletePage(idPage) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM pages WHERE id = ?';
        db.run(sql, idPage, (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

function deleteBlock(idPage, idBlock) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM blocks WHERE id = ? AND idpage = ?';
        db.run(sql, [idBlock, idPage], (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

function updatePage(idPage, page) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pages SET title=?, iduser=?, creationdate=?, publicationdate=? WHERE id=?';
        db.run(sql, [page.title, page.idUser, page.creationDate, page.publicationDate ? page.publicationDate : null, idPage], (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

function updateBlock(idPage, idBlock, block) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE blocks SET idpage=?, type=?, content=?, position=? WHERE id=? AND idpage=?';
        db.run(sql, [block.idPage, block.type, block.content, block.position, idBlock, idPage], (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

exports.getAllPages = getAllPages;
exports.getPages = getPages;
exports.getPageContent = getPageContent;
exports.getPubPageContent = getPubPageContent;
exports.createPage = createPage;
exports.createBlock = createBlock;
exports.deletePage = deletePage;
exports.deleteBlock = deleteBlock;
exports.updatePage = updatePage;
exports.updateBlock = updateBlock;
exports.getWebsiteName = getWebsiteName;
exports.updateWebsiteName = updateWebsiteName;

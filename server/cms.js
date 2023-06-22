'use strict';

const dayjs = require("dayjs");

function Page(id, title, idUser, creationDate, publicationDate) {
    this.id = id;
    this.title = title;
    this.idUser = idUser;
    this.creationDate = dayjs(creationDate);
    this.publicationDate = publicationDate ? dayjs(publicationDate) : publicationDate;
}

function Block(id, idPage, type, content, position) {
    this.id = id;
    this.idPage = idPage;
    this.type = type;
    this.content = content;
    this.position = position;
}

function Website(id, title) {
    this.id = id;
    this.title = title;
}

exports.Page = Page;
exports.Block = Block;
exports.Website = Website;

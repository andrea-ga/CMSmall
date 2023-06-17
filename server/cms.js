'use strict';

const dayjs = require("dayjs");

function Page(id, title, idUser, creationDate, publicationDate) {
    this.id = id;
    this.title = title;
    this.idUser = idUser;
    this.creationDate = dayjs(creationDate);
    this.publicationDate = dayjs(publicationDate);
}

function Block(id, idPage, type, content, position) {
    this.id = id;
    this.idPage = idPage;
    this.type = type;
    this.content = content;
    this.position = position;
}

exports.Page = Page;
exports.Block = Block;

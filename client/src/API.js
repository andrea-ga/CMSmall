const APIURL = 'http://localhost:3000/api';

async function getWebsiteName() {
    try {
        const response = await fetch(APIURL + '/name');
        if(response.ok) {
            return await response.json();
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e);
    }
}

async function updateWebsiteName(title) {
    try {
        const response = await fetch(APIURL + '/name', {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title
            })
        });
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error();
        }
    } catch(e) {
        throw new Error(e);
    }
}

async function getPages() {
    try {
        const response = await fetch(APIURL + '/pages');
        if (response.ok) {
            return await response.json();
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function getBlocks(idPage) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`);
        if (response.ok) {
            return await response.json();
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function updateBlock(idPage, idBlock, type, content, position) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}/blocks/${idBlock}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "idPage": idPage,
                "type": type,
                "content": content,
                "position": position
            })
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function addPage(title, idUser, creationDate, publicationDate) {
    try {
        const response = await fetch(APIURL + `/pages`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "idUser": idUser,
                "creationDate": creationDate,
                "publicationDate": publicationDate
            })
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function updatePage(idPage, title, idUser, creationDate, publicationDate) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "idUser": idUser,
                "creationDate": creationDate,
                "publicationDate": publicationDate
            })
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function deletePage(idPage) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            }
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function addBlock(idPage, type, content, position) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                idPage: idPage,
                type: type,
                content: content,
                position: position
            })
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

async function deleteBlock(idPage, idBlock) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}/blocks/${idBlock}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            }
        });
        if (response.ok) {
            return await response.json;
        } else
            throw new Error();
    } catch(e) {
        throw new Error(e) ;
    }
}

export { getPages, getBlocks, updateBlock, addPage, updatePage, getWebsiteName,
    updateWebsiteName, deletePage, addBlock, deleteBlock };
const APIURL = 'http://localhost:3000/api';

async function getWebsiteName() {
    try {
        const response = await fetch(APIURL + '/name', {
            credentials: 'include'
        });
        if(response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function updateWebsiteName(title) {
    try {
        const response = await fetch(APIURL + '/name', {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "title": title
            })
        });
        if(response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function getAllPages() {
    try {
        const response = await fetch(APIURL + '/pages/all', {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function getPages() {
    try {
        const response = await fetch(APIURL + '/pages', {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function getBlocks(idPage) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function getPubBlocks(idPage) {
    try {
        const response = await fetch(APIURL + `/pages/pub/${idPage}`, {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function updateBlock(idPage, idBlock, type, content, position) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}/blocks/${idBlock}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "idPage": idPage,
                "type": type,
                "content": content,
                "position": position
            })
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function addPage(title, idUser, creationDate, publicationDate, blocks) {
    try {
        const response = await fetch(APIURL + `/pages`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "title": title,
                "idUser": idUser,
                "creationDate": creationDate,
                "publicationDate": publicationDate,
                "blocks": blocks
            })
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function updatePage(idPage, title, idUser, creationDate, publicationDate) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "title": title,
                "idUser": idUser,
                "creationDate": creationDate,
                "publicationDate": publicationDate
            })
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function deletePage(idPage) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function addBlock(idPage, type, content, position) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                idPage: idPage,
                type: type,
                content: content,
                position: position
            })
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function deleteBlock(idPage, idBlock, position) {
    try {
        const response = await fetch(APIURL + `/pages/${idPage}/blocks/${idBlock}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                position: position
            })
        });
        if (response.ok) {
            return await response.json;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch(e) {
        throw new Error(e.message, { cause: e });
    }
}

async function checkLogin(username, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function doLogout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            return true ;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getUsername(idUser) {
    try {
        const response = await fetch(APIURL + `/users/${idUser}`, {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getAllAuthors() {
    try {
        const response = await fetch(APIURL + `/users`, {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

export { getAllPages, getPages, getBlocks, getPubBlocks, updateBlock, addPage, updatePage, getWebsiteName,
    updateWebsiteName, deletePage, addBlock, deleteBlock, checkLogin, doLogout, getUsername, getAllAuthors };
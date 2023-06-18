const APIURL = 'http://localhost:3000/api';

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

export { getPages, getBlocks };
'use strict';

const PORT = 3000;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const pagesDao = require('./pages-dao');
const userDao = require('./user-dao');
const {Website, Page, Block} = require('./cms');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password)
    if(!user)
        return callback(null, false, 'Incorrect username or password');

    return callback(null, user);
}));

passport.serializeUser(function (user, callback) {
    callback(null, { id: user.id, email: user.email, username: user.username, role: user.role });
});

passport.deserializeUser(function (user, callback) {
    return callback(null, user);
});

const session = require('express-session');
const {getAllPages, updateBlock} = require("./pages-dao");

app.use(session({
    secret: "yyyyyyyyxxxxxxxzzzzzzz",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

/******* LOGIN - LOGOUT OPERATIONS *******/

// POST /api/login
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
})

app.get('/api/users/:idUser', (req, res) => {
    const id = req.params.idUser;
    userDao.getUserById(id).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
})

app.get('/api/users', isLoggedIn, (req, res) => {
    userDao.getAllUsers().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
})

//GET WEBSITE NAME
app.get('/api/name', (req, res) => {
    pagesDao.getWebsiteName().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
})

//CHANGE WEBSITE NAME
app.put('/api/name', isLoggedIn, (req, res) => {
    const website = new Website(null, req.body.title);
    pagesDao.updateWebsiteName(website).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
})

//GET ALL PAGES (PUBLISHED AND NOT)
app.get('/api/pages/all', isLoggedIn, (req, res) => {
    pagesDao.getAllPages().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//GET ONLY PUBLISHED PAGES
app.get('/api/pages', (req, res) => {
    pagesDao.getPages().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//GET BLOCKS OF A PAGE (PUBLISHED AND NOT)
app.get('/api/pages/:idPage', isLoggedIn, (req, res) => {
    const idPage = req.params.idPage;

    pagesDao.getPageContent(idPage).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//GET BLOCKS OF A PUBLISHED PAGE
app.get('/api/pages/pub/:idPage', (req, res) => {
    const idPage = req.params.idPage;

    pagesDao.getPubPageContent(idPage).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//ADD PAGE
app.post('/api/pages', isLoggedIn, (req, res) => {
        const page = new Page(null, req.body.title, req.body.idUser, req.body.creationDate, req.body.publicationDate);
    pagesDao.createPage(page).then((result) => {
        req.body.blocks.map((b) => {
            pagesDao.getAllPages().then((pages) => {
                const idPage = pages.sort((a,b) => (b.id - a.id))[0].id;
                const block = new Block(null, idPage, b.type, b.content, b.position);
                pagesDao.createBlock(block).then((result) => {
                    res.end();
                }).catch((error) => {
                    res.set('Content-Type: text/plain');
                    res.status(500).send(error.message);
                })
            }).catch((error) => {
                res.set('Content-Type: text/plain');
                res.status(500).send(error.message);
            });
        });
    }).catch((error) => {
        res.set('Content-Type: text/plain');
        res.status(500).send(error.message);
    });
});

//ADD BLOCK TO A PAGE
app.post('/api/pages/:idPage', isLoggedIn, (req, res) => {
    const block = new Block(null, req.params.idPage, req.body.type, req.body.content, req.body.position);
    pagesDao.createBlock(block).then((result) => {
        res.end();
    }).catch((error) => {
        res.set('Content-Type: text/plain');
        res.status(500).send(error.message);
    });
});

//DELETE A PAGE
app.delete('/api/pages/:idPage', isLoggedIn, (req, res) => {
    const idPage = req.params.idPage;
    pagesDao.deletePage(idPage).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//DELETE A BLOCK FROM A PAGE
app.delete('/api/pages/:idPage/blocks/:idBlock', isLoggedIn, (req, res) => {
    const idPage = req.params.idPage;
    const idBlock = req.params.idBlock;
    const position = req.body.position;
    pagesDao.deleteBlock(idPage, idBlock).then((result) => {
        pagesDao.getPageContent(idPage).then((list) => {
            const blocksToUpdate = list.filter((b) => b.idPage == idPage && b.position > position);

            if(blocksToUpdate.length != 0) {
                blocksToUpdate.map(b => {
                    pagesDao.updateBlock(b.idPage, b.id, {...b, position: b.position-1}).then((result) => {
                        res.end();
                    }).catch((error) => {
                        res.status(500).send(error.message);
                    });
                });
            } else
                res.end();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//UPDATE A PAGE
app.put('/api/pages/:idPage', isLoggedIn, (req, res) => {
    const idPage = req.params.idPage;
        const page = new Page(null, req.body.title, req.body.idUser, req.body.creationDate, req.body.publicationDate);
    pagesDao.updatePage(idPage, page).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

//UPDATE A BLOCK OF A PAGE
app.put('/api/pages/:idPage/blocks/:idBlock', isLoggedIn, (req, res) => {
    const idPage = req.params.idPage;
    const idBlock = req.params.idBlock;
    const block = new Block(null, req.body.idPage, req.body.type, req.body.content, req.body.position);
    pagesDao.updateBlock(idPage, idBlock, block).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });
'use strict';

const crypto = require('crypto');

const db = require('./db');

function getUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql, [username], (err, row) => {
            if (err) { // database error
                reject(err);
            } else {
                if (!row) { // non-existent user
                    reject('Invalid username or password');
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
                        if (err) { // key derivation fails
                            reject(err);
                        } else {
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.password, 'hex'));
                            if (equal) { // password ok
                                resolve(row);
                            } else { // password doesn't match
                                reject('Invalid username or password');
                            }
                        }
                    });
                }
            }
        });
    });
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username FROM users WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if(err)
                reject(err);
            else {
                resolve(row);
            }
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username FROM users';
        db.all(sql, (err, rows) => {
            if(err)
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
}

exports.getUser = getUser;
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;

import mysql from "mysql2";
import { sqlSettings } from "./sql";

export const likeComment = (userid, commentid) => {
    let connection = mysql.createConnection(sqlSettings());
    connection.connect();

    connection.query(
        'SELECT * FROM comments WHERE commentid = ?',
        [commentid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Comment does not exist');
            }
        }
    );

    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User does not exist');
            }
        }
    );

    connection.query(
        'SELECT * FROM likes WHERE userid = ? AND commentid = ?',
        [userid, commentid],
        (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                throw new Error('User already liked this comment');
            }
        }
    );

    connection.query(
        'INSERT INTO likes (userid, commentid) VALUES (?, ?)',
        [userid, commentid],
        (err) => {
            if (err) throw err;
        }
    );

    connection.end();

    return true;
}

export const unlikeComment = (userid, commentid) => {
    let connection = mysql.createConnection(sqlSettings());
    connection.connect();

    connection.query(
        'SELECT * FROM comments WHERE commentid = ?',
        [commentid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Comment does not exist');
            }
        }
    );

    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User does not exist');
            }
        }
    );

    connection.query(
        'SELECT * FROM likes WHERE userid = ? AND commentid = ?',
        [userid, commentid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User has not liked this comment');
            }
        }
    );

    connection.query(
        'DELETE FROM likes WHERE userid = ? AND commentid = ?',
        [userid, commentid],
        (err) => {
            if (err) throw err;
        }
    );

    connection.end();

    return true;
}

export const getLikes = (commentid) => {
    let connection = mysql.createConnection(sqlSettings());
    connection.connect();

    connection.query(
        'SELECT * FROM likes WHERE commentid = ?',
        [commentid],
        (err, result) => {
            if (err) throw err;
            return result;
        }
    );

    connection.end();
}
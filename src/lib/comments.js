import mysql from 'mysql';
import { sqlSettings } from './sql.js';

export const createComment = (comment) => {
    let connection = mysql.createConnection(sqlSettings());
    connection.connect();

    //check comment parameters
    if (!comment.userid || !comment.postid || !comment.content) {
        throw new Error('Invalid comment parameters');
    }

    //check if user exists
    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [comment.userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User does not exist');
            }
        }
    );

    //check if post exists
    connection.query(
        'SELECT * FROM posts WHERE postid = ?',
        [comment.postid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Post does not exist');
            }
        }
    );

    //check if parent comment exists
    if (comment.parentid) {
        connection.query(
            'SELECT * FROM comments WHERE commentid = ?',
            [comment.parentid],
            (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    throw new Error('Parent comment does not exist');
                }
            }
        );
    }

    //check if user already commented
    connection.query(
        'SELECT * FROM comments WHERE userid = ? AND postid = ?',
        [comment.userid, comment.postid],
        (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                throw new Error('User already commented on this post');
            }
        }
    );

    //create comment
    connection.query(
        'INSERT INTO comments (userid, postid, content, parentid) VALUES (?, ?, ?)',
        [comment.userid, comment.postid, comment.content, comment.parentid ? null : comment.parentid],
        (err, result) => {
            if (err) throw err;
            console.log('Comment created');
        }
    );

    connection.end();

    return true;
}


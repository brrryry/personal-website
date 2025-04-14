import mysql from "mysql";
import { createCommentsTable, sqlSettings } from "./sql.js";

export const createComment = (comment) => {
  let connection = mysql.createConnection(sqlSettings());
  createCommentsTable(connection);

  connection.connect();

  //check comment parameters
  if (!comment.userid || !comment.postid || !comment.content) {
    throw new Error("Invalid comment parameters");
  }

  //check if user exists
  connection.query(
    "SELECT * FROM accounts WHERE userid = ?",
    [comment.userid],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        throw new Error("User does not exist");
      }
    },
  );

  //check if post exists
  connection.query(
    "SELECT * FROM posts WHERE postid = ?",
    [comment.postid],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        throw new Error("Post does not exist");
      }
    },
  );

  //check if parent comment exists
  if (comment.parentid) {
    connection.query(
      "SELECT * FROM comments WHERE commentid = ?",
      [comment.parentid],
      (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          throw new Error("Parent comment does not exist");
        }
      },
    );
  }

  //check if user already commented
  connection.query(
    "SELECT * FROM comments WHERE userid = ? AND postid = ?",
    [comment.userid, comment.postid],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        throw new Error("User already commented on this post");
      }
    },
  );

  //create comment
  connection.query(
    "INSERT INTO comments (userid, postid, content, parentid) VALUES (?, ?, ?)",
    [
      comment.userid,
      comment.postid,
      comment.content,
      comment.parentid ? null : comment.parentid,
    ],
    (err, result) => {
      if (err) throw err;
      console.log("Comment created");
    },
  );

  connection.end();

  return true;
};

export const getComments = (postid) => {
  if (!postid) {
    throw new Error("Invalid comment parameters");
  }

  let connection = mysql.createConnection(sqlSettings());
  createCommentsTable(connection);

  connection.connect();

  let comments = [];
  let totalComments = 0;

  connection.query(
    "SELECT * FROM comments WHERE postid = ?",
    [postid],
    (err, result) => {
      if (err) throw err;
      comments = result;
      totalComments = result.length;
    },
  );

  connection.end();

  //create comment tree!
  for (let i = 0; i < comments.length; i++) {
    comments[i].replies = [];
  }

  for (let i = 0; i < comments.length; i++) {
    if (comments[i].parentid) {
      for (let j = 0; j < comments.length; j++) {
        if (comments[j].commentid === comments[i].parentid) {
          comments[j].replies.push(comments[i]);
        }
      }
    }
  }

  comments = comments.filter((comment) => !comment.parentid);

  return { comments, totalComments };
};

export const deleteComment = (commentid) => {
  if (!commentid) {
    throw new Error("Invalid comment parameters");
  }

  let connection = mysql.createConnection(sqlSettings());
  createCommentsTable(connection);

  connection.connect();

  connection.query(
    "UPDATE comments SET deleted = true WHERE commentid = ?",
    [commentid],
    (err, result) => {
      if (err) throw err;
      console.log("Comment deleted");
    },
  );

  connection.end();

  return true;
};

export const editComment = (commentid, content) => {
  if (!commentid || !content) {
    throw new Error("Invalid comment parameters");
  }

  let connection = mysql.createConnection(sqlSettings());
  createCommentsTable(connection);

  connection.connect();

  connection.query(
    "UPDATE comments SET content = ? WHERE commentid = ?",
    [content, commentid],
    (err, result) => {
      if (err) throw err;
      console.log("Comment edited");
    },
  );

  connection.end();

  return true;
};

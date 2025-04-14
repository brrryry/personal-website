import mysql from "mysql2";

export const sqlSettings = () => {
  const env = process.env.NODE_ENV;

  if (env === "development") {
    return {
      host: process.env.DB_HOST_DEV,
      port: process.env.DB_PORT_DEV,
      user: process.env.DB_USER_DEV,
      password: process.env.DB_PASSWORD_DEV,
      database: process.env.DB_NAME_DEV,
    };
  } else if (env === "production") {
    return {
      host: process.env.DB_HOST_PROD,
      port: process.env.DB_PORT_PROD,
      user: process.env.DB_USER_PROD,
      password: process.env.DB_PASSWORD_PROD,
      database: process.env.DB_NAME_PROD,
    };
  } else {
    throw new Error("Invalid environment");
  }
};

export const createAccountTable = () => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  //if the accounts table does not exist, create it
  connection.query(
    `CREATE TABLE IF NOT EXISTS accounts (
            userid BINARY(16) PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            password VARCHAR(255) NOT NULL,
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            banned BOOLEAN DEFAULT FALSE NOT NULL,
            admin BOOLEAN DEFAULT FALSE NOT NULL,
        )`,
    (err, result) => {
      if (err) throw err;
      console.log("Table created or already exists");
    },
  );
  connection.end();
};

export const createSessionsTable = () => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  //if the sessions table does not exist, create it
  connection.query(
    `CREATE TABLE IF NOT EXISTS sessions (
            sessionid BINARY(16) PRIMARY KEY,
            userid BINARY(16) NOT NULL,
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            lastAccessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (userid) REFERENCES accounts(userid)
        )`,
    (err, result) => {
      if (err) throw err;
      console.log("Table created or already exists");
    },
  );
  connection.end();
};

export const createCommentsTable = () => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  //if the comments table does not exist, create it
  connection.query(
    `CREATE TABLE IF NOT EXISTS comments (
            commentid BINARY(16) PRIMARY KEY,
            userid BINARY(16) NOT NULL,
            postid VARCHAR(255) NOT NULL,
            parentid BINARY(16) DEFAULT NULL,
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            content TEXT NOT NULL,
            FOREIGN KEY (userid) REFERENCES accounts(userid),
            FOREIGN KEY (postid) REFERENCES posts(postid)
            deleted BOOLEAN DEFAULT FALSE NOT NULL,
        )`,
    (err, result) => {
      if (err) throw err;
      console.log("Table created or already exists");
    },
  );
  connection.end();
};

export const createLikesTable = () => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  //if the likes table does not exist, create it
  connection.query(
    `CREATE TABLE IF NOT EXISTS likes (
            likeid BINARY(16) PRIMARY KEY,
            userid BINARY(16) NOT NULL,
            commentid VARCHAR(255) NOT NULL,
            FOREIGN KEY (userid) REFERENCES accounts(userid),
            FOREIGN KEY (commentid) REFERENCES comments(commentid)
        )`,
    (err, result) => {
      if (err) throw err;
      console.log("Table created or already exists");
    },
  );

  connection.end();
};

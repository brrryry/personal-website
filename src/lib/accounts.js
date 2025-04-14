import mysql from 'mysql2';
import { createSessionsTable, sqlSettings } from './sql';
import { createAccountTable } from './sql';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const createAccount = (account) => {
  createAccountTable();

  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

    //check account parameters
    if (!account.username || !account.password) {
        throw new Error('Invalid account parameters!');
    }

    //check if account already exists
    connection.query(
        'SELECT * FROM accounts WHERE name = ?',
        [account.username],
        (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                throw new Error('Account already exists!');
            }
        }
    );

  //hash password
  bcrypt.hash(account.password, saltRounds, (err, hash) => {
    if (err) throw err;
    account.password = hash;
  });

    //create account
    connection.query(
        'INSERT INTO accounts (name, password) VALUES (?, ?)',
        [account.username, account.password],
        (err, result) => {
            if (err) throw err;
            console.log('Account created!');
        }
    );

  connection.end();

  return true;
};

export const login = (account) => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  let userid = null;

    //check account parameters
    if (!account.username || !account.password) {
        throw new Error('Invalid account parameters!');
    }

    //check if account exists
    connection.query(
        'SELECT * FROM accounts WHERE name = ?',
        [account.username],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Username or password is incorrect. Try again.');
            }

      if (result[0].banned) {
        throw new Error("Account is banned. Contact for more information.");
      }

      //check password
      bcrypt.compare(account.password, result[0].password, (err, res) => {
        if (err) throw err;
        if (!res) {
          throw new Error("Username or password is incorrect. Try again.");
        }
        console.log("Login successful!");
      });

      userid = result[0].userid;
    },
  );

  connection.end();

    let sessionid = null;
    //create session
    connection = mysql.createConnection(sqlSettings());
    connection.connect();
    connection.query(
        'INSERT INTO sessions (sessionid, userid) VALUES (UUID_TO_BIN(UUID()), ?)',
        [userid],
        (err, result) => {
            if (err) throw err;
            console.log('Session created!');
            console.log(result);
            sessionid = result.insertId;
        }
    );

  return sessionid;
};

export const logout = (sessionid) => {
    let connection = mysql.createConnection(sqlSettings());
    createAccountTable();
    connection.connect();

    //check if session exists
    connection.query(
        'SELECT * FROM sessions WHERE sessionid = ?',
        [sessionid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Session does not exist!');
            }
        }
    );

    //delete session
    connection.query(
        'DELETE FROM sessions WHERE sessionid = ?',
        [sessionid],
        (err, result) => {
            if (err) throw err;
            console.log('Session deleted!');
        }
    );

  connection.end();

  return true;
};

export const banAccount = (userid) => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

    //check account parameters
    if (!userid) {
        throw new Error('Invalid account parameters!');
    }

    //check if account exists
    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Account does not exist!');
            }
        }
    );

    //ban account
    connection.query(
        'UPDATE accounts SET banned = TRUE WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            console.log('Account banned!');
        }
    );

    //delete all sessions for the account
    connection.query(
        'DELETE FROM sessions WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            console.log('Sessions deleted!');
        }
    );

  connection.end();
  return true;
};

export const getUserFromSession = (sessionid) => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  let user = null;

    //check if session exists
    connection.query(
        'SELECT * FROM sessions WHERE sessionid = ?',
        [sessionid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('Session does not exist!');
            }
        }
    );

    //get user from session
    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [result[0].userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User does not exist!');
            }
            user = result[0];
        }
    );

  connection.end();
  user.password = null;
  return user;
};

export const getUserFromId = (userid) => {
  let connection = mysql.createConnection(sqlSettings());
  connection.connect();

  let user = null;

    //check if user exists
    connection.query(
        'SELECT * FROM accounts WHERE userid = ?',
        [userid],
        (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                throw new Error('User does not exist!');
            }
            user = result[0];
        }
    );

  connection.end();
  user.password = null;
  return user;
};

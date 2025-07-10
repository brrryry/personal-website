import {accounts, sessions} from './accounts/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

import * as typecheck from './typecheck.js';
import { type } from 'os';
import { BadRequestError, RouteError, NotFoundError, AuthenticationError } from './errors.ts';
import NotFound from '@/app/[...not_found]/page.js';

const saltRounds = Number(process.env.SALT_ROUNDS) || 16;

const createNewAccount = async (username, password) => {
  const accountCollection = await accounts();

  typecheck.isValidString(username, 'username');
  typecheck.isValidString(password, 'password');


  try {
    await getAccountByUsername(username);
    throw BadRequestError("username already exists")
  } catch(e) {
  }

  //make sure username can be used in a url query
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw BadRequestError("username can only contain alphanumeric characters, underscores, and hyphens.");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newAccount = {
    username: username,
    password: hashedPassword,
    bio: ''
  };



  let insertInfo;
  
  try {
    insertInfo = await accountCollection.insertOne(newAccount);
  } catch(e) {
    throw RouteError(`error inserting new account on backend...`)
  }

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw RouteError(`could not create account on backend...`)
  }

  const newAccountId = insertInfo.insertedId.toString();
  const createdAccount = await getAccountById(newAccountId);
  return createdAccount;

}

const getAccountByUsername = async (username, needPassword = false) => {
  const accountCollection = await accounts();

  typecheck.isValidString(username, 'username');

  const account = await accountCollection.findOne({
    username: username
  }, {
    projection: needPassword ? {} : { password: 0 } // Exclude password if not needed
  });


  if (!account) throw NotFoundError(`account with username "${username}" not found`);

  return account;
}

const getAccountById = async (accountId) => {
  const accountCollection = await accounts();

  typecheck.isValidString(accountId, 'account id');

  if (!ObjectId.isValid(accountId)) throw BadRequestError("Invalid account ID format");
  

  const account = await accountCollection.findOne({
    _id: new ObjectId(accountId)
  }, {
    projection: { password: 0 } // Exclude password
  });

  if (!account) throw NotFoundError(`account with ID "${accountId}" not found`);

  return account;
}

const getAccountBySessionId = async (sessionId) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(sessionId, 'session id');

  const session = await sessionCollection.findOne({ sessionId: sessionId });

  if (!session) throw NotFoundError(`session with ID "${sessionId}" not found`);

  const account = await getAccountById(session.accountId.toString());

  return {
    _id: account._id.toString(),
    username: account.username,
    bio: account.bio,
    sessionId: session.sessionId,
  };
}

const updateAccountBio = async (accountId, newBio) => {
  const accountCollection = await accounts();

  typecheck.isValidString(accountId, 'account id');
  typecheck.isValidString(newBio, 'new bio');

  if (!ObjectId.isValid(accountId)) {
    throw BadRequestError("invalid account id format");
  }

  const updateInfo = await accountCollection.updateOne(
    { _id: new ObjectId(accountId) },
    { $set: { bio: newBio } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw NotFoundError(`account with ID "${accountId}" not found or no changes made`);
  }

  return await getAccountById(accountId);
}

const authenticateAccount = async (username, password) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(username, 'username');
  typecheck.isValidString(password, 'password');

  let account;

  try {
    account = await getAccountByUsername(username, true);
  } catch(e) {
    throw AuthenticationError(`incorrect username or password.`);
  }


  const isPasswordValid = await bcrypt.compare(password, account.password);
  if (!isPasswordValid) {
    throw AuthenticationError(`incorrect username or password.`);
  }

  // Create a new session
  const sessionId = v4();
  const newSession = {
    accountId: account._id.toString(),
    sessionId: sessionId,
    createdAt: new Date()
  };

  // Insert the session into the database with an expiration time of 24 hours
  const insertInfo = await sessionCollection.insertOne(newSession);
  
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw RouteError(`Could not create session`);
  }
  
  return {
    _id: account._id.toString(),
    username: account.username,
    sessionId: sessionId,
  };
}

const logoutAccount = async (sessionId) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(sessionId, 'session id');

  const deleteInfo = await sessionCollection.deleteOne({ sessionId: sessionId });

  if (deleteInfo.deletedCount === 0) {
    throw NotFoundError(`session with id "${sessionId}" not found`);
  }
  return { success: true };
}

const getCommentsByAccountId = async (accountId) => {
  const commentCollection = await comments();

  accountId = typecheck.stringToOid(accountId, "account id");

  const comments = await commentCollection.find({ accountId: accountId }).toArray();

  return comments.map(comment => ({
    _id: comment._id.toString(),
    blogId: comment.blogId.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    accountId: comment.accountId.toString()
  }));
}

export {
  createNewAccount,
  getAccountByUsername,
  getAccountById,
  updateAccountBio,
  authenticateAccount,
  getCommentsByAccountId,
  getAccountBySessionId,
  logoutAccount,
}
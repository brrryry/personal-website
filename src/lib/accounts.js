import {accounts, sessions} from './accounts/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

import * as typecheck from './typecheck.js';
import { type } from 'os';

const saltRounds = Number(process.env.SALT_ROUNDS) || 16;

const createNewAccount = async (username, password) => {
  const accountCollection = await accounts();

  typecheck.isValidString(username, 'Username');
  typecheck.isValidString(password, 'Password');

  try {
    await getAccountByUsername(username);
    throw { status: 400, error: 'username already exists' };
  } catch(e) {
    if (e?.status !== 404) throw e;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newAccount = {
    username: username,
    password: hashedPassword,
    bio: '',
    nano: false,
    isNano: false, // Default to false, can be updated later
  };

  let insertInfo;
  
  try {
    insertInfo = await accountCollection.insertOne(newAccount);
  } catch(e) {
    console.log(`Error inserting new account: ${e}`);
    throw { status: 500, error: 'Error inserting new account' };
  }

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw { status: 500, error: 'Could not create account' };
  }

  const newAccountId = insertInfo.insertedId.toString();
  const createdAccount = await getAccountById(newAccountId);
  return createdAccount;

}

const getAccountByUsername = async (username, needPassword = false) => {
  const accountCollection = await accounts();

  typecheck.isValidString(username, 'Username');

  const account = await accountCollection.findOne({
    username: username
  }, {
    projection: needPassword ? {} : { password: 0 } // Exclude password if not needed
  });


  if (!account) throw { status: 404, error: 'account not found' };

  return account;
}

const getAccountById = async (accountId) => {
  const accountCollection = await accounts();

  typecheck.isValidString(accountId, 'Account ID');

  if (!ObjectId.isValid(accountId)) {
    throw { status: 400, error: 'Invalid account ID format' };
  }

  const account = await accountCollection.findOne({
    _id: new ObjectId(accountId)
  }, {
    projection: { password: 0 } // Exclude password
  });

  if (!account) throw { status: 404, error: 'Account not found' };

  return account;
}

const getAccountBySessionId = async (sessionId) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(sessionId, 'Session ID');

  const session = await sessionCollection.findOne({ sessionId: sessionId });

  if (!session) throw { status: 404, error: 'Session not found' };

  const account = await getAccountById(session.accountId.toString());

  return {
    _id: account._id.toString(),
    username: account.username,
    bio: account.bio,
    nano: account.nano,
    isNano: account.isNano,
    sessionId: session.sessionId,
  };
}

const updateAccountBio = async (accountId, newBio) => {
  const accountCollection = await accounts();

  typecheck.isValidString(accountId, 'Account ID');
  typecheck.isValidString(newBio, 'New Bio');

  if (!ObjectId.isValid(accountId)) {
    throw { status: 400, error: 'Invalid account ID format' };
  }

  const updateInfo = await accountCollection.updateOne(
    { _id: new ObjectId(accountId) },
    { $set: { bio: newBio } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw { status: 404, error: 'Account not found or no changes made' };
  }

  return await getAccountById(accountId);
}

const authenticateAccount = async (username, password) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(username, 'Username');
  typecheck.isValidString(password, 'Password');

  let account;

  try {
    account = await getAccountByUsername(username, true);
  } catch(e) {
    throw { status: 404, error: 'incorrect username or password.' };
  }


  const isPasswordValid = await bcrypt.compare(password, account.password);
  if (!isPasswordValid) {
    throw { status: 401, error: 'incorrect username or password.' };
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
    throw { status: 500, error: 'Could not create session' };
  }
  
  return {
    _id: account._id.toString(),
    username: account.username,
    sessionId: sessionId,
  };
}

const logoutAccount = async (sessionId) => {
  const sessionCollection = await sessions();

  typecheck.isValidString(sessionId, 'Session ID');

  const deleteInfo = await sessionCollection.deleteOne({ sessionId: sessionId });

  if (deleteInfo.deletedCount === 0) {
    throw { status: 404, error: 'Session not found' };
  }
  return { success: true };
}

const getCommentsByAccountId = async (accountId) => {
  const commentCollection = await comments();

  accountId = typecheck.stringToOid(accountId);

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
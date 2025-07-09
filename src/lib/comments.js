import {comments} from './accounts/mongoCollections.js';
import {ObjectId} from 'mongodb';

import { getAccountById } from './accounts.js';

import * as typecheck from './typecheck.js';

const createComment = async (accountId, blogId, content) => {
  const commentCollection = await comments();

  console.log('Creating comment for blog:', blogId, 'by account:', accountId);

  typecheck.isValidString(accountId, 'Account ID');
  typecheck.isValidString(blogId, 'Blog ID');
  typecheck.isValidString(content, 'Content');

  if (!ObjectId.isValid(accountId)) {
    throw { status: 400, error: 'Invalid account or blog ID format' };
  }

  //make sure only one comment can be made by an account on a blog
  const existingComment = await commentCollection.findOne({ accountId: new ObjectId(accountId), blogId: blogId });
  if (existingComment) {
    throw { status: 400, error: 'You have already commented on this blog' };
  }

  const account = await getAccountById(accountId);

  const newComment = {
    accountId: new ObjectId(accountId),
    username: account.username,
    blogId: blogId,
    content: content,
    createdAt: new Date()
  };

  const insertInfo = await commentCollection.insertOne(newComment);
  
  if (insertInfo.insertedCount === 0) {
    throw { status: 500, error: 'Could not add comment' };
  }

  return {
    _id: insertInfo.insertedId.toString(),
    ...newComment
  };
}

const getBlogComments = async (blogId) => {
  const commentCollection = await comments();
  let returnComments = [];

  typecheck.isValidString(blogId, 'Blog ID');

  const commentsList = await commentCollection.find({ blogId: blogId }).toArray();



  for (let comment of commentsList) {
    let acc = await getAccountById(comment.accountId.toString());
    let user = acc.username;

    returnComments.push({
      _id: comment._id.toString(),
      accountId: comment.accountId.toString(),
      blogId: comment.blogId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ? comment.updatedAt : null,
      username: user
    });
  }

  return returnComments;

}

const editComment = async (commentId, newContent) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, 'Comment ID');
  typecheck.isValidString(newContent, 'New Content');

  if (!ObjectId.isValid(commentId)) {
    throw { status: 400, error: 'Invalid comment ID format' };
  }

  const updateInfo = await commentCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $set: { content: newContent,
      updatedAt: new Date()
     } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw { status: 404, error: 'Comment not found or no changes made' };
  }

  return await getCommentById(commentId);
}

const getCommentById = async (commentId) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, 'Comment ID');

  if (!ObjectId.isValid(commentId)) {
    throw { status: 400, error: 'Invalid comment ID format' };
  }

  const comment = await commentCollection.findOne({ _id: new ObjectId(commentId) });

  if (!comment) {
    throw { status: 404, error: 'Comment not found' };
  }

  return {
    _id: comment._id.toString(),
    accountId: comment.accountId.toString(),
    blogId: comment.blogId,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ? comment.updatedAt : null,
  };
}

const deleteComment = async (commentId) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, 'Comment ID');

  if (!ObjectId.isValid(commentId)) {
    throw { status: 400, error: 'Invalid comment ID format' };
  }

  const deleteInfo = await commentCollection.deleteOne({ _id: new ObjectId(commentId) });

  if (deleteInfo.deletedCount === 0) {
    throw { status: 404, error: 'Comment not found' };
  }

  return { deleted: true };
}

const getUserComments = async (username) => {
  const commentCollection = await comments();
  let returnComments = [];

  typecheck.isValidString(username, 'username');

  const commentsList = await commentCollection.find({ username: username }).toArray();
  for (let comment of commentsList) {
    let acc = await getAccountById(comment.accountId.toString());
    let user = acc.username;

    returnComments.push({
      _id: comment._id.toString(),
      accountId: comment.accountId.toString(),
      blogId: comment.blogId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ? comment.updatedAt : null,
      username: user
    });
  }

  return returnComments;
}

export {
  createComment,
  getBlogComments,
  editComment,
  getCommentById,
  deleteComment,
  getUserComments,
}
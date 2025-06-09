import {comments} from './accounts/mongoCollections.js';
import {ObjectId} from 'mongodb';

import * as typecheck from './typecheck.js';

const createComment = async (accountId, blogId, content) => {
  const commentCollection = await comments();

  typecheck.isValidString(accountId, 'Account ID');
  typecheck.isValidString(blogId, 'Blog ID');
  typecheck.isValidString(content, 'Content');

  if (!ObjectId.isValid(accountId)) {
    throw { status: 400, error: 'Invalid account or blog ID format' };
  }

  const newComment = {
    accountId: new ObjectId(accountId),
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

  typecheck.isValidString(blogId, 'Blog ID');

  if (!ObjectId.isValid(blogId)) {
    throw { status: 400, error: 'Invalid blog ID format' };
  }

  const commentsList = await commentCollection.find({ blogId: blogId }).toArray();

  return commentsList.sort((a, b) => b.createdAt - a.createdAt).map(comment => ({
    _id: comment._id.toString(),
    accountId: comment.accountId.toString(),
    content: comment.content,
    createdAt: comment.createdAt
  }));
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
    createdAt: comment.createdAt
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

export {
  createComment,
  getBlogComments,
  editComment,
  getCommentById,
  deleteComment
}
import { comments } from "./accounts/mongoCollections.js";
import { ObjectId } from "mongodb";

import { getAccountById } from "./accounts.js";

import * as typecheck from "./typecheck.js";
import { BadRequestError, RouteError, NotFoundError } from "./errors.ts";

const createComment = async (accountId, blogId, content) => {
  const commentCollection = await comments();

  console.log("Creating comment for blog:", blogId, "by account:", accountId);

  typecheck.isValidString(accountId, "account ID");
  typecheck.isValidString(blogId, "blog ID");
  typecheck.isValidString(content, "content");

  if (!ObjectId.isValid(accountId)) {
    throw new BadRequestError("Invalid account id format");
  }

  //make sure only one comment can be made by an account on a blog
  const existingComment = await commentCollection.findOne({
    accountId: new ObjectId(accountId),
    blogId: blogId,
  });
  if (existingComment) {
    throw new BadRequestError("You have already commented on this blog");
  }

  const account = await getAccountById(accountId);

  if (content.length > 500) {
    throw new BadRequestError("Content cannot exceed 500 characters");
  }

  const newComment = {
    accountId: new ObjectId(accountId),
    username: account.username,
    blogId: blogId,
    content: content,
    createdAt: new Date(),
  };

  const insertInfo = await commentCollection.insertOne(newComment);

  if (insertInfo.insertedCount === 0) {
    throw new RouteError(`Could not add comment`);
  }

  return {
    _id: insertInfo.insertedId.toString(),
    ...newComment,
  };
};

const getBlogComments = async (blogId) => {
  const commentCollection = await comments();
  let returnComments = [];

  typecheck.isValidString(blogId, "blog id");

  const commentsList = await commentCollection
    .find({ blogId: blogId })
    .toArray();

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
      username: user,
    });
  }

  return returnComments;
};

const editComment = async (commentId, newContent, accountId) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, "comment id");
  typecheck.isValidString(newContent, "new content");
  typecheck.isValidString(accountId, "account id");

  if (!ObjectId.isValid(commentId)) {
    throw new BadRequestError("Invalid comment id format");
  }

  if (newContent.length > 500) {
    throw new BadRequestError("Content cannot exceed 500 characters");
  }

  const comment = await commentCollection.findOne({
    _id: new ObjectId(commentId),
  });
  if (!comment)
    throw new NotFoundError(`Comment with id "${commentId}" not found`);
  if (comment.accountId.toString() !== accountId)
    throw new BadRequestError("You can only edit your own comments");

  const updateInfo = await commentCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $set: { content: newContent, updatedAt: new Date() } },
  );

  if (updateInfo.modifiedCount === 0) {
    throw new NotFoundError(
      `Comment with id "${commentId}" not found or no changes made`,
    );
  }

  return await getCommentById(commentId);
};

const getCommentById = async (commentId) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, "comment id");

  if (!ObjectId.isValid(commentId)) {
    throw new BadRequestError("Invalid comment id format");
  }

  const comment = await commentCollection.findOne({
    _id: new ObjectId(commentId),
  });

  if (!comment) {
    throw new NotFoundError(`Comment with id "${commentId}" not found`);
  }

  return {
    _id: comment._id.toString(),
    accountId: comment.accountId.toString(),
    blogId: comment.blogId,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ? comment.updatedAt : null,
  };
};

const deleteComment = async (commentId) => {
  const commentCollection = await comments();

  typecheck.isValidString(commentId, "comment id");

  if (!ObjectId.isValid(commentId)) {
    throw new BadRequestError("Invalid comment id format");
  }

  const deleteInfo = await commentCollection.deleteOne({
    _id: new ObjectId(commentId),
  });

  if (deleteInfo.deletedCount === 0) {
    throw new NotFoundError(`Comment with id "${commentId}" not found`);
  }

  return { deleted: true };
};

const getUserComments = async (username) => {
  const commentCollection = await comments();
  let returnComments = [];

  typecheck.isValidString(username, "username");

  const commentsList = await commentCollection
    .find({ username: username })
    .toArray();
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
      username: user,
    });
  }

  return returnComments;
};

export {
  createComment,
  getBlogComments,
  editComment,
  getCommentById,
  deleteComment,
  getUserComments,
};

import { getBlogComments, createComment, deleteComment, editComment } from "@/lib/comments";
import { getAccountBySessionId } from "@/lib/accounts";
import { NextResponse } from "next/server";
import { handleError, RouteError } from "@/lib/errors";

export async function GET(req, { params }) {
  const comments = await getBlogComments(params.id);
  return NextResponse.json(comments);
}

export async function POST(req, { params }) {
    const { content, sessionId } = await req.json();

    try {
    const account = await getAccountBySessionId(sessionId);
    const newComment = await createComment(account._id, params.id, content);
    return NextResponse.json(newComment);
  } catch (error) {
    const err = RouteError.fromBaseError(error, "post /api/comments/[id]");
    return handleError(err);
  }
}

export async function DELETE(req, { params }) {
  const { commentId, sessionId } = await req.json();

  try {
    const account = await getAccountBySessionId(sessionId);
    await deleteComment(commentId, account._id);
    return NextResponse.json({ message: "comment deleted successfully" });
  } catch (error) {
      const err = RouteError.fromBaseError(error, "post /api/comments/[id]");
      return handleError(err);
  }
}

export async function PUT(req, { params }) {
  const { commentId, content, sessionId } = await req.json();

  try {
    const account = await getAccountBySessionId(sessionId);
    const updatedComment = await editComment(commentId, content, account._id);
    return NextResponse.json(updatedComment);
  } catch (error) {
    const err = RouteError.fromBaseError(error, "put /api/comments/[id]");
    return handleError(err);
  }
}
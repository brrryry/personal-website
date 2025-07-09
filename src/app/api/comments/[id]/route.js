import { getBlogComments, createComment, deleteComment, editComment } from "@/lib/comments";
import { getAccountBySessionId } from "@/lib/accounts";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const comments = await getBlogComments(params.id);
  return NextResponse.json(comments);
}

export async function POST(req, { params }) {
    const { content, sessionId } = await req.json();

    
    if (!content || !sessionId) {
        return NextResponse.json({ error: "either no commment content or you aren't logged in" }, { status: 400 });
    }

    // Validate sessionId
    const account = await getAccountBySessionId(sessionId);
    if (!account) {
        return NextResponse.json({ error: "Invalid session ID" }, { status: 401 });
    }

    try {
    const newComment = await createComment(account._id, params.id, content);
    return NextResponse.json(newComment);
  } catch (error) {
    console.error("error creating comment:", error);
    return NextResponse.json({ error: error.error.toLowerCase() || "failed to create comment!"}, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { commentId, sessionId } = await req.json();

  if (!commentId || !sessionId) {
    return NextResponse.json({ error: "Comment ID and session ID are required" }, { status: 400 });
  }

  // Validate sessionId
  const account = await getAccountBySessionId(sessionId);
  if (!account) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 401 });
  }


  try {
    await deleteComment(commentId, account._id);
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("error deleting comment:", error);
    return NextResponse.json({ error: error.error.toLowerCase() || "failed to delete comment!"}, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { commentId, content, sessionId } = await req.json();

  if (!commentId || !content || !sessionId) {
    return NextResponse.json({ error: "invalid commentid, content or session. are you logged in?" }, { status: 400 });
  }

  // Validate sessionId
  const account = await getAccountBySessionId(sessionId);
  if (!account) {
    return NextResponse.json({ error: "invalid session id. maybe logout and log back in?" }, { status: 401 });
  }


  try {
    const updatedComment = await editComment(commentId, content);
    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json({ error: error.error.toLowerCase() || "failed to edit comment!"}, { status: 500 });
  }
}
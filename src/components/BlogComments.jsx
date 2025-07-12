"use client";

import { useSession } from "./SessionContext";
import { useState, useEffect } from "react";

export function BlogComments({ blogId }) {
    const { session, loading } = useSession();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        if (blogId) {
            fetch(`/api/comments/${blogId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => setComments(data))
                .catch((error) => console.error("error fetching comments:", error));
        }

        // Wait for comments to render before scrolling
        const hash = window.location.hash;
        if (hash === "#comments-section") {
            setTimeout(() => {
            const commentsSection = document.querySelector(".comments-section");
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            }, 100); // slight delay to ensure DOM is ready
        }
    }, [blogId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`/api/comments/${blogId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newComment, sessionId: session?.sessionId }),
            });

            const commentData = await response.json();

            if(commentData.status === "failed") {
                setError(commentData.reason || "failed to post comment");
                throw new Error(commentData.reason || "failed to post comment");
            }

            setComments([...comments, commentData]);
            setNewComment("");
            setError(null);
        } catch (error) {
            setError(error.message || "failed to post comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            const response = await fetch(`/api/comments/${blogId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ commentId, sessionId: session?.sessionId }),
            });

            const res = await response.json();
            if (res.status === "failed") {
                setError(res.reason || "failed to delete comment");
                throw new Error(res.reason || "failed to delete comment");
            }

            setComments(comments.filter((comment) => comment._id !== commentId));
            setError(null);
        } catch (error) {
            setError(error.message || "failed to delete comment");
        }
    };

    // Edit handlers
    const handleEditClick = (comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
        setError(null);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent("");
        setError(null);
    };

    const handleEditSave = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            const response = await fetch(`/api/comments/${blogId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ commentId, content: editContent, sessionId: session?.sessionId }),
            });

            const updated = await response.json();

            if (updated.status === "failed") {
                setError(updated.reason || "failed to edit comment");
                throw new Error(updated.reason || "failed to edit comment");
            }

            setComments(
                comments.map((c) =>
                    c._id === commentId ? { ...c, content: updated.content, updatedAt: updated.updatedAt } : c
                )
            );
            setEditingId(null);
            setEditContent("");
            setError(null);
        } catch (error) {
            setError(error.message || "failed to edit comment");
        }
    };

    // Helper function to get "time ago" string
    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;
        const years = Math.floor(days / 365);
        return `${years}y ago`;
    }

    return (
        <div className="comments-section max-w-4xl">
            - - - - -
            <h3>comments</h3>

            {comments.length === 0 && <p>no comments yet. be the first to comment!</p>}

            {comments.length > 0 && (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            {editingId === comment._id ? (
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="bg-gray-200 border p-2 rounded text-black w-full"
                                    />
                                    <div>
                                        <button
                                            onClick={() => handleEditSave(comment._id)}
                                            className="mr-2"
                                            disabled={loading}
                                        >
                                            save
                                        </button>
                                        <button onClick={handleEditCancel}>cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="break-words">{comment.content}{" "}
                                    <span className="text-sm mb-0">{timeAgo(comment.createdAt)}</span>
                                    <span className="text-sm mb-0">
                                        {comment.updatedAt ? `, updated ${timeAgo(comment.updatedAt)}` : ""}
                                    </span>
                                    </p>
                                    <small className="mt-0">{"\t"}- <a href={`/profile/${comment.username}`}>{comment.username}</a></small>
                                    {session?._id === comment.accountId && (
                                        <>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleEditClick(comment);
                                                }}
                                                style={{
                                                    marginLeft: "8px",
                                                    color: "#d8bfd8",
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                                className="text-sm"
                                            >
                                                edit
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteComment(comment._id);
                                                }}
                                                style={{
                                                    marginLeft: "8px",
                                                    color: "#d8bfd8",
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                                className="text-sm"
                                            >
                                                delete
                                            </a>
                                        </>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <br />

            {session?.sessionId && (
                <form onSubmit={handleCommentSubmit} className="space-y-2 flex flex-col">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="add a comment!"
                        className="bg-gray-300 border p-2 rounded text-black h-full"
                        required
                    />
                    <button type="submit" disabled={loading || !session?.sessionId} className="h-full">
                        post comment
                    </button>
                </form>
            )}

            {!session?.sessionId && (
                <p>
                    please <a href="/login">log in</a> to post a comment.
                </p>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
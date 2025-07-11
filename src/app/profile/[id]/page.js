"use client"

import React, { useState, useEffect } from 'react';

const Profile = ({params}) => {
    
    const { id } = params;

    const [username, setUsername] = useState("");
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/account/${id}`);
                if (!response.ok) {
                    throw new Error("failed to fetch profile");
                }
                const data = await response.json();
                
                if (!data.account) setError(data.reason);
                else {
                    setUsername(data.account.username || "");
                    setComments(data.comments || []);
                }
            } catch (error) {
                setError(error.reason);
            }
        };

        fetchProfile();
    }, [id]);


    return (
        <div className="flex justify-center items-center p-4">
            <div className="rounded shadow-md p-4 max-w-4xl">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <h3 className="block mb-2">username: {username}</h3>
                </div>

                <div className="mb-4 max-w-4xl">
                    <h3 className="block mb-2">comments</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map(comment => (
                                <li key={comment._id} className="border-b py-2 break-words">
                                    <a href={`/blog/${comment.blogId}#comments-section`} className="text-[#d8bfd8] hover:underline">
                                        {comment.blogId}
                                    </a> - {comment.content} {" "}
                                    <span className="text-sm">({new Date(comment.createdAt).toLocaleDateString()})</span>
                                    <span className="text-sm"> - {comment.updatedAt ? `Updated: ${new Date(comment.updatedAt).toLocaleDateString()}` : "Not updated"}</span>
                                    <br />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments found</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Profile;
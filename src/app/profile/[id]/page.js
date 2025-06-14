"use client"

import React, { useState, useEffect } from 'react';

const Profile = ({params}) => {
    
    const { id } = params;

    const [username, setUsername] = useState("");
    const [nano, setNano] = useState("");
    const [isNano, setIsNano] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/account?id=${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                const data = await response.json();
                setUsername(data.username);
                setNano(data.nano);
                setIsNano(data.isNano);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProfile();
    }, [id]);


    return (
        <div className="flex justify-center items-center p-4">
            <div className="rounded shadow-md p-4">
                <h2 className="text-2xl mb-4">Profile</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2">username</label>
                    <p>{username}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">nano account?</label>
                    <p>{nano ? "yes" : "no"}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">is nano?</label>
                    <p>{isNano ? "yes" : "no"}</p>
                </div>
            </div>
        </div>
    );

}

export default Profile;
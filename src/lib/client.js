export function authenticateSession(sessionId) {
    return fetch("/api/account/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Authentication failed");
        }
        return response.json();
    });
}
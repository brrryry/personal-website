"use client"

import Link from "next/link";

const Login = () => {


    const handleSubmit = (event) => {
        event.preventDefault();
        
        //get username and password
        const username = event.target[0].value;
        const password = event.target[1].value;

        //try to login
        let loginattempt = (callback) => {
            fetch('/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('login failed');
                }
                return response.json();
            })
            .then(data => {
                ///console.log('Login successful:', data);
                callback(null, data);
            })
            .catch(error => {
                callback(error, null);
            });
        }


        // Call loginattempt with a callback
        loginattempt((error, data) => {
            if (error) {
                // Handle error, e.g., show an error message
                document.querySelector('.text-red-300').textContent = 'login failed. check your credentials.';
                document.querySelector('.text-red-300').classList.remove('hidden');
            } else {
                // Handle successful login, e.g., redirect or update UI
                document.querySelector('.text-red-300').classList.add('hidden');
                // Redirect to home page or update UI accordingly

                //set cookie 
                document.cookie = `sessionid=${data.sessionId}; path=/; max-age=86400;`; // 1 day expiration

                window.location.href = '/';
            }
        })

    }

    return (
        <div className="space-y-5 justify-center items-center flex flex-col">
        <h2>login</h2>
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
            <input type="text" placeholder="username" className="bg-gray-300 border p-2 rounded text-black" />
            <input type="password" placeholder="password" className="bg-gray-300 border p-2 rounded text-black" />
            <button type="submit" className="bg-[#6a0dad] text-white p-2 rounded">login</button>
        </form>
        <p>need an account? <Link href="/register">register</Link></p>
        <p className="text-red-300 hidden">this is error</p>
        </div>
    );
}

export default Login;
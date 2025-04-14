import { login } from "@/lib/accounts";

export async function POST(req) {

    let session = null;
    const account = await req.json();
  
    if(!account.name) return new Response(JSON.stringify({ error: 'Username is required!' }), { status: 400 });

    if(!account.password) return new Response(JSON.stringify({ error: 'Password is required!' }), { status: 400 });

    try {
        session = await login(account);
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Login successful!", session: session }), { status: 200 });
}
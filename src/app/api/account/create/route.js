import { createAccount } from "@/lib/accounts";

export async function POST(req) {

    const account = await req.json();
  
    if(!account.username) return new Response(JSON.stringify({ error: 'Username is required!' }), { status: 400 });

    if(!account.password) return new Response(JSON.stringify({ error: 'Password is required!' }), { status: 400 });

    try {
        await createAccount(account);
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Account created successfully!" }), { status: 200 });
}

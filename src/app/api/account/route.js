import { getUserFromId } from "@/lib/accounts";

export async function GET(req) {
    const { userid } = req.params;

    let user = null;

    try {
        user = await getUserFromId(userid);
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
}
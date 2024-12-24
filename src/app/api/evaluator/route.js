import { connectToDatabase } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const { db } = await connectToDatabase();
        const users = await db.collection("users").find({}).toArray();

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { db } = await connectToDatabase();
        const {user_id, aura} = req.body;
        const user = await db.collection("users").findOne({ user_id });

        if(!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        await db.collection("users").updateOne({ _id: new ObjectId(user_id) }, { $set: { aura: Number(aura) } });
    } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
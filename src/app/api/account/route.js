import { getUserFromId } from "@/lib/accounts";

export async function GET(req) {
  let req_json = await req.json();
  let userid = req_json.params.userid;

  let user = null;

  try {
    user = await getUserFromId(userid);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}

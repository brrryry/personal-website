"use server";

import { getAccountBySessionId } from "@/lib/accounts";
import {NanoHome} from "@/components/nanohub/NanoHome";
import { cookies } from "next/headers";
import Link from "next/link";

import { SecretMessage2025 } from "@/components/nanohub/2025/SecretMessage2025";

export default async function Home({year}) {

  const cookiesList = cookies();
  const sessionCookie = cookiesList.get("sessionid");
  let session = null;

  try {
    session = await getAccountBySessionId(sessionCookie?.value);
  } catch (e) {}

  const username = session?.username;
  const nano = session?.nano;
  const isNano = session?.isNano;

  const secretMessages = {
    2025: isNano ? [<SecretMessage2025 key={1}/>] : null,
  }


  if (!session) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <p>you cannot see this page unless you are logged into a nano-approved account.</p>
        <p>please <Link href="/login">log in.</Link></p>
      </div>
    );
  }

  if (!nano) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <p>you are not a nano-approved account!.</p>
        <p>please <Link href={`/profile/${username}`}>check your profile</Link> for reference.</p>
      </div>
    );
  }

  return (
    <NanoHome
      nano={nano}
      isNano={isNano}
      secretMessages={secretMessages}
    />
  )
}

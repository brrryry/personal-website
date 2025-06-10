import { headers } from "next/headers";

export default async function Home() {

  // Get the headers to check if the user is logged in
  const hdrs = await headers();

  const isLoggedIn = hdrs.get("isLoggedIn") === "true";
  const username = hdrs.get("username");

  return (
    <div className="space-y-5 justify-center items-center flex flex-col">
      <h1>for nano</h1>
    </div>
  );
}

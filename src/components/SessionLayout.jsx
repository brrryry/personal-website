// components/SessionLayout.js
import { cookies } from "next/headers";
import { getAccountBySessionId } from "@/lib/accounts";
import { SessionProvider } from "@/components/SessionContext";

export default async function SessionLayout({ children }) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value || "";
  let account = null;

  try {
    if (sessionId) {
      account = await getAccountBySessionId(sessionId);
    }
  } catch (e) {
    console.error("Session fetch failed:", e);
  }

  return (
    <SessionProvider session={account}>
      {children}
    </SessionProvider>
  );
}

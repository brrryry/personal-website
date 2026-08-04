import fs from "fs";
import path from "path";
import http from "http";
import readline from "readline";
import { exec } from "child_process";

const PORT = 8000;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

// Helper to prompt user
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

// Helper to open URL in browser
function openBrowser(url) {
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  exec(`${start} "${url}"`, (err) => {
    if (err) {
      console.log(`\nPlease open this URL in your browser:\n${url}\n`);
    }
  });
}

// Parse .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let val = match[2] || "";
        // Remove quotes if any
        if (
          val.length > 0 &&
          val.charAt(0) === '"' &&
          val.charAt(val.length - 1) === '"'
        ) {
          val = val.substring(1, val.length - 1);
        } else if (
          val.length > 0 &&
          val.charAt(0) === "'" &&
          val.charAt(val.length - 1) === "'"
        ) {
          val = val.substring(1, val.length - 1);
        }
        env[key] = val;
      }
    });
  }
  return env;
}

// Write/Update .env file
function updateEnv(key, value) {
  const envPath = path.resolve(process.cwd(), ".env");
  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf-8");
  }

  const lines = content.split("\n");
  let found = false;
  const newLines = lines.map((line) => {
    if (line.trim().startsWith(`${key}=`)) {
      found = true;
      return `${key}="${value}"`;
    }
    return line;
  });

  if (!found) {
    if (newLines.length > 0 && newLines[newLines.length - 1].trim() !== "") {
      newLines.push("");
    }
    newLines.push(`${key}="${value}"`);
  }

  fs.writeFileSync(envPath, newLines.join("\n"), "utf-8");
  console.log(`\nUpdated ${key} in .env file successfully!`);
}

async function main() {
  const env = loadEnv();

  let clientId = env.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
  let clientSecret =
    env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId) {
    console.log("SPOTIFY_CLIENT_ID not found in .env.");
    clientId = await askQuestion("Enter your Spotify Client ID: ");
  }
  if (!clientSecret) {
    console.log("SPOTIFY_CLIENT_SECRET not found in .env.");
    clientSecret = await askQuestion("Enter your Spotify Client Secret: ");
  }

  if (!clientId || !clientSecret) {
    console.error("Client ID and Client Secret are required.");
    process.exit(1);
  }

  // Save them back to env if they were prompted
  if (!env.SPOTIFY_CLIENT_ID) updateEnv("SPOTIFY_CLIENT_ID", clientId);
  if (!env.SPOTIFY_CLIENT_SECRET)
    updateEnv("SPOTIFY_CLIENT_SECRET", clientSecret);

  console.log(
    `\n1. Go to the Spotify Developer Dashboard (https://developer.spotify.com/dashboard)`,
  );
  console.log(`2. Select your App, click 'Settings'`);
  console.log(`3. Under 'Redirect URIs', add: ${REDIRECT_URI} and save.`);

  await askQuestion(
    "\nPress Enter once you have added the Redirect URI to Spotify Dashboard...",
  );

  // Generate random state
  const state = Math.random().toString(36).substring(2, 15);

  // Scopes needed for currently-playing
  const scope = "user-read-currently-playing";

  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    }).toString();

  // Create temporary server
  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);

    if (reqUrl.pathname === "/callback") {
      const code = reqUrl.searchParams.get("code");
      const receivedState = reqUrl.searchParams.get("state");
      const error = reqUrl.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Error</h1><p>${error}</p>`);
        console.error(`Authorization error: ${error}`);
        server.close();
        process.exit(1);
      }

      if (receivedState !== state) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>State Mismatch</h1>`);
        console.error("State mismatch error.");
        server.close();
        process.exit(1);
      }

      // Exchange code for tokens
      try {
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          },
          body: new URLSearchParams({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
          }).toString(),
        });

        const tokens = await tokenRes.json();

        if (tokens.error) {
          throw new Error(tokens.error_description || tokens.error);
        }

        const refreshToken = tokens.refresh_token;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #121212; color: #ffffff;">
              <div style="background-color: #181818; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; max-width: 500px;">
                <h1 style="color: #1DB954; margin-top: 0;">Success!</h1>
                <p>Spotify Refresh Token has been successfully retrieved and printed to your terminal.</p>
                <p style="color: #b3b3b3; font-size: 14px;">You can close this tab now.</p>
              </div>
            </body>
          </html>
        `);

        console.log(`\n========================================`);
        console.log(`Success! Spotify Refresh Token retrieved:\n`);
        console.log(refreshToken);
        console.log(`========================================\n`);

        updateEnv("SPOTIFY_REFRESH_TOKEN", refreshToken);

        console.log("Done! Script exiting.");
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>Token Exchange Failed</h1><p>${err.message}</p>`);
        console.error("Failed to retrieve access token:", err);
        server.close();
        process.exit(1);
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT, () => {
    console.log(`\nStarting local server on http://localhost:${PORT}...`);
    console.log(`Opening browser to Spotify authorize page...`);
    openBrowser(authUrl);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

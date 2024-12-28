import pkg from "./package.json" with { type: "json" };
import { execSync } from "child_process";

// Starts a command line process to get the git hash
const commitHash = execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

const fullCommitHash = execSync("git rev-parse HEAD").toString().trim();

const nextConfig = {
  // Other configs
  env: {
    // Add the package.json version and git hash to the environment
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash,
    FULL_COMMIT_HASH: fullCommitHash,
  },
  reactStrictMode: false,
  crossOrigin: 'anonymous',

  async headers() {
    return [{
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://bryanchan.org/evaluator" }, // replace this your actual origin
        { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
        { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
      ]
    }]
  }
};

export default nextConfig;

import { execSync } from "child_process";

export default async function globalSetup() {
  console.log("\n🔄 Resetting database before test run...");
  execSync("npm run db:reset", { stdio: "inherit", cwd: process.cwd() });
  console.log("✅ Database ready.\n");
}

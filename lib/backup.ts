import "dotenv/config";
import { execSync } from "node:child_process";
import path from "node:path";

const {
  RESTIC_REPOSITORY_LOCAL,
  RESTIC_REPOSITORY_R2,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

if (!RESTIC_REPOSITORY_LOCAL)
  throw Error("RESTIC_REPOSITORY_LOCAL is missing in .env");
if (!RESTIC_REPOSITORY_R2)
  throw Error("RESTIC_REPOSITORY (R2) is missing in .env");

const SRC_DATA = path.resolve("src/data");

// Local backup
console.log("\n=== Local backup ===");
execSync(`restic -r ${RESTIC_REPOSITORY_LOCAL} backup ${SRC_DATA}`, {
  env: { ...process.env },
  stdio: "inherit",
});

// R2 backup
console.log("\n=== R2 backup ===");
execSync(`restic -r ${RESTIC_REPOSITORY_R2} backup ${SRC_DATA}`, {
  env: {
    ...process.env,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  },
  stdio: "inherit",
});

console.log("\nBackup complete.");

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const simulation = process.argv.find((argument) => argument.startsWith("--simulate-audit-status="));
let auditStatus;

if (simulation) {
  auditStatus = Number(simulation.split("=")[1]);
} else {
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const audit = spawnSync(process.execPath, [path.join(directory, "audit-form-accessibility.mjs"), "--negative-test"], {
    stdio: "inherit",
  });
  auditStatus = audit.status;
}

if (auditStatus === 1) {
  console.log("Form accessibility negative gate passed: audit fixture was rejected with status 1.");
  process.exit(0);
}

const printableStatus = auditStatus === null ? "signal-or-runner-failure" : String(auditStatus);
console.error(`Form accessibility negative gate failed: expected audit status 1, received ${printableStatus}.`);
process.exit(1);

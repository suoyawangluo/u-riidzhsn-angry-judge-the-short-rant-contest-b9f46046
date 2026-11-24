// Angry Judge: The Short Rant Contest — make.fun entry
// Writes one short funny rant about an everyday annoyance to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt). Gate: 1-400 characters, not only whitespace.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The rant, built from named parts so each sentence earns its place.
const SETUP =
  "The office microwave beeps five times when my food is done, then beeps again when I open the door, as if I hadn't been standing right here watching it count down.";
const ACCUSATION = "It is not reminding me. It is filing a performance review.";
const PUNCHLINE =
  "I heated soup for ninety seconds and now a small white box thinks I need supervision.";

function buildRant(): string {
  return [SETUP, ACCUSATION, PUNCHLINE].join(" ");
}

type GateReport = { codePoints: number; singleText: boolean };

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 400) {
    throw new Error(`gate failed: ${codePoints} code points, need 1-400`);
  }
  if (!text.trim()) {
    throw new Error("gate failed: entry is only whitespace");
  }
  console.log(`gate passes: ${codePoints} code points, not only whitespace`);
  return { codePoints, singleText: !text.includes("\n") };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== expected + "\n") {
    throw new Error("read-back mismatch: written file differs from entry");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildRant();
  const report = validateEntry(entry);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, "entry.txt");
  writeFileSync(path, entry + "\n", "utf8");
  const sha = verifyWritten(path, entry);
  console.log(`wrote ${path} (${report.codePoints} code points, sha256 ${sha})`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();

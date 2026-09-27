// Turns the working tree into a static-exportable site for GitHub Pages:
// removes server-only routes and swaps Server Actions for preview stand-ins.
// It deletes files, so it only runs in CI unless --force is passed.
import { cpSync, rmSync } from "node:fs";

if (!process.env.CI && !process.argv.includes("--force")) {
  console.error("prepare-pages: refusing to modify a local checkout. Run in CI or pass --force on a throwaway copy.");
  process.exit(1);
}

for (const dir of ["src/app/api", "src/app/checkout"]) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`removed ${dir}`);
}

for (const file of ["checkout.ts", "forms.ts"]) {
  cpSync(`pages-preview/actions/${file}`, `src/actions/${file}`);
  console.log(`replaced src/actions/${file} with preview stand-in`);
}

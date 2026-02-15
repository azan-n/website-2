import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export async function GET() {
  const resume = readFileSync(join(cwd(), "src", "pages", "_resume.pdf"));

  if (!resume) {
    throw Error("Could not find resume.pdf");
  }

  return new Response(resume.buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=azan-n-resume.pdf",
    },
  });
}

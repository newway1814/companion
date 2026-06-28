import { getUser } from "@/lib/auth";
import { getUserExportData } from "@/lib/account/repository";
import { serializeUserExport } from "@/lib/account/export";

/**
 * Downloads the signed-in user's data export (their sessions, transcripts, and
 * feedback) as JSON. Auth-gated and scoped to the user — never another's data.
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await getUserExportData(user.id);
  const body = JSON.stringify(serializeUserExport(data), null, 2);

  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="companion-export.json"',
      "Cache-Control": "no-store",
    },
  });
}

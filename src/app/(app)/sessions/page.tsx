import { getUser } from "@/lib/auth";
import { listSessionsForUser } from "@/lib/interview/repository";

import { deleteSessionAction } from "./actions";
import { buildSessionRows } from "./history";
import { SessionHistory } from "./session-history";

export default async function SessionHistoryPage() {
  const user = await getUser();
  const sessions = user ? await listSessionsForUser(user.id) : [];
  const rows = buildSessionRows(sessions);

  return <SessionHistory rows={rows} deleteAction={deleteSessionAction} />;
}

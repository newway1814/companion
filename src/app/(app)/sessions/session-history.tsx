"use client";

import { History, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { filterSessionRows, type SessionRow } from "./history";

export type DeleteSessionAction = (formData: FormData) => void | Promise<void>;

const PAGE_SIZE = 8;

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function Readiness({ row }: { row: SessionRow }) {
  if (row.readinessScore == null) {
    return <span className="text-on-surface-variant">—</span>;
  }
  return (
    <span className="font-mono text-mono-label text-on-surface">
      {row.readinessScore}%
      {row.readinessBand ? (
        <span className="ml-2 text-on-surface-variant capitalize">
          {row.readinessBand}
        </span>
      ) : null}
    </span>
  );
}

function RowActions({
  row,
  deleteAction,
  confirming,
  onConfirm,
  onCancel,
}: {
  row: SessionRow;
  deleteAction: DeleteSessionAction;
  confirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      {row.hasReport ? (
        <Link
          href={`/interview/${row.id}/report`}
          className="rounded px-2 py-1 text-body-md text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Open report
        </Link>
      ) : null}
      {confirming ? (
        <form action={deleteAction} className="flex items-center gap-1">
          <input type="hidden" name="sessionId" value={row.id} />
          <span className="text-mono-label text-on-surface-variant">Delete?</span>
          <button
            type="submit"
            className="rounded px-2 py-1 text-body-md font-medium text-on-error-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
          >
            Confirm delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-2 py-1 text-body-md text-on-surface-variant hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={onConfirm}
          className="rounded px-2 py-1 text-body-md text-on-surface-variant hover:text-on-error-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export function SessionHistory({
  rows,
  deleteAction,
}: {
  rows: SessionRow[];
  deleteAction: DeleteSessionAction;
}) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-5xl p-gutter">
        <Header query={query} setQuery={setQuery} showSearch={false} />
        <div className="mt-8 rounded-lg border border-outline-variant bg-surface-container-lowest p-10 text-center">
          <History
            className="mx-auto size-7 text-on-surface-variant"
            aria-hidden="true"
          />
          <p className="mt-3 text-body-lg text-on-surface">
            No practice sessions yet.
          </p>
          <Link
            href="/setup"
            className="mt-4 inline-flex items-center justify-center rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Start a project deep-dive
          </Link>
        </div>
      </div>
    );
  }

  const filtered = filterSessionRows(rows, query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages - 1);
  const start = current * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <Header
        query={query}
        setQuery={(value) => {
          setQuery(value);
          setPage(0);
        }}
        showSearch
      />

      <div className="mt-6 overflow-x-auto rounded-lg border border-outline-variant">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Your saved practice sessions</caption>
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr className="text-label-caps uppercase tracking-wide text-on-surface-variant">
              <th scope="col" className="px-4 py-3 font-bold">Date</th>
              <th scope="col" className="px-4 py-3 font-bold">Resume</th>
              <th scope="col" className="px-4 py-3 font-bold">Target role</th>
              <th scope="col" className="px-4 py-3 font-bold">Readiness score</th>
              <th scope="col" className="px-4 py-3 font-bold">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-outline-variant last:border-0"
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-mono-label text-on-surface-variant">
                  {formatDate(row.createdAtISO)}
                </td>
                <td className="px-4 py-3 text-body-md text-on-surface">
                  {row.resumeName}
                </td>
                <td className="px-4 py-3 text-body-md text-on-surface">
                  {row.roleTitle}
                </td>
                <td className="px-4 py-3">
                  <Readiness row={row} />
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded border border-outline-variant px-2 py-0.5 text-label-caps font-bold uppercase tracking-wide text-on-surface-variant">
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    row={row}
                    deleteAction={deleteAction}
                    confirming={confirmingId === row.id}
                    onConfirm={() => setConfirmingId(row.id)}
                    onCancel={() => setConfirmingId(null)}
                  />
                </td>
              </tr>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-body-md text-on-surface-variant"
                >
                  No sessions match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-body-md text-on-surface-variant">
        <p>
          {filtered.length === 0
            ? "No sessions"
            : `Showing ${start + 1} to ${start + pageRows.length} of ${filtered.length} session${filtered.length === 1 ? "" : "s"}`}
        </p>
        {totalPages > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="rounded border border-outline-variant px-3 py-1 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Previous
            </button>
            <span aria-current="page" className="px-2">
              Page {current + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={current >= totalPages - 1}
              className="rounded border border-outline-variant px-3 py-1 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Header({
  query,
  setQuery,
  showSearch,
}: {
  query: string;
  setQuery: (value: string) => void;
  showSearch: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-display-md text-on-surface">
          Session history
        </h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          Review past mock interviews and deep-dive reports.
        </p>
      </div>
      {showSearch ? (
        <div className="relative">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant",
            )}
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search sessions"
            placeholder="Search sessions…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-64 rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      ) : null}
    </div>
  );
}

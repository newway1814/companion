import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    resume: { findMany: vi.fn(), deleteMany: vi.fn() },
    targetRole: { deleteMany: vi.fn() },
    interviewSession: { deleteMany: vi.fn(), findMany: vi.fn() },
    user: { delete: vi.fn() },
    $transaction: vi.fn(async (ops: unknown[]) => Promise.all(ops)),
  },
}));

import { prisma } from "@/lib/prisma";

import {
  clearWorkspaceData,
  deleteUserData,
  listResumeStoragePaths,
} from "./repository";

const resume = vi.mocked(prisma.resume);
const targetRole = vi.mocked(prisma.targetRole);
const session = vi.mocked(prisma.interviewSession);
const user = vi.mocked(prisma.user);

describe("account repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("collects only the user's stored resume paths", async () => {
    resume.findMany.mockResolvedValue([
      { storagePath: "u1/a.pdf" },
      { storagePath: null },
    ] as never);

    const paths = await listResumeStoragePaths("u1");

    expect(resume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "u1" } }),
    );
    expect(paths).toEqual(["u1/a.pdf"]);
  });

  it("clears all of the user's resumes, roles, and sessions (scoped)", async () => {
    await clearWorkspaceData("u1");

    expect(resume.deleteMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
    expect(targetRole.deleteMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
    expect(session.deleteMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
  });

  it("deletes the user's own account row, cascading their data", async () => {
    await deleteUserData("u1");

    expect(user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    targetRole: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from "@/lib/prisma";

import {
  deleteTargetRole,
  listTargetRoles,
  setActiveTargetRole,
  updateTargetRole,
} from "./repository";

const role = vi.mocked(prisma.targetRole);

describe("target role repository per-user scoping", () => {
  beforeEach(() => vi.clearAllMocks());

  it("only lists the given user's roles", () => {
    listTargetRoles("user-1");
    expect(role.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
  });

  it("updates only when both the role id and owner match", () => {
    updateTargetRole("user-1", "role-9", { title: "T", rawText: "x" });
    expect(role.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "role-9", userId: "user-1" } }),
    );
  });

  it("deletes only the owner's role", () => {
    deleteTargetRole("user-1", "role-9");
    expect(role.deleteMany).toHaveBeenCalledWith({
      where: { id: "role-9", userId: "user-1" },
    });
  });

  it("activates one role scoped to its owner, clearing the owner's others", async () => {
    await setActiveTargetRole("user-1", "role-9");
    expect(role.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { isActive: false },
    });
    expect(role.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "role-9", userId: "user-1" } }),
    );
  });
});

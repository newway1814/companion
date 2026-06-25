import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    resume: {
      findMany: vi.fn(),
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
  createResume,
  deleteResume,
  listResumes,
  setActiveResume,
} from "./repository";

const resume = vi.mocked(prisma.resume);

describe("resume repository per-user scoping", () => {
  beforeEach(() => vi.clearAllMocks());

  it("only lists the given user's resumes", () => {
    listResumes("user-1");
    expect(resume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
  });

  it("deletes only when both the resume id and owner match", () => {
    deleteResume("user-1", "resume-9");
    expect(resume.deleteMany).toHaveBeenCalledWith({
      where: { id: "resume-9", userId: "user-1" },
    });
  });

  it("activates a resume scoped to its owner, clearing the owner's others", async () => {
    await setActiveResume("user-1", "resume-9");

    // Clears every resume for this user…
    expect(resume.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { isActive: false },
    });
    // …then activates only the owner's target resume.
    expect(resume.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "resume-9", userId: "user-1" } }),
    );
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("marks the first resume active and later ones inactive", async () => {
    resume.count.mockResolvedValueOnce(0);
    await createResume({
      userId: "user-1",
      filename: "a.pdf",
      source: "PASTE",
      rawText: "x",
    });
    expect(resume.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isActive: true }) }),
    );

    resume.count.mockResolvedValueOnce(2);
    await createResume({
      userId: "user-1",
      filename: "b.pdf",
      source: "PASTE",
      rawText: "y",
    });
    expect(resume.create).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isActive: false }) }),
    );
  });
});

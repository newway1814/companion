import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResumeUploadForm } from "./resume-upload-form";
import type { AddResumeState } from "./types";

const ok = vi.fn(async (): Promise<AddResumeState> => ({ error: undefined }));

describe("ResumeUploadForm", () => {
  it("submits pasted resume text to the action", async () => {
    const action = vi.fn(
      async (_s: AddResumeState, formData: FormData): Promise<AddResumeState> => {
        expect(formData.get("text")).toBe("My resume text");
        return { error: undefined };
      },
    );
    render(<ResumeUploadForm action={action} />);

    await userEvent.type(
      screen.getByLabelText(/paste your resume text/i),
      "My resume text",
    );
    await userEvent.click(screen.getByRole("button", { name: /add resume/i }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("rejects a non-PDF file client-side and blocks submission", async () => {
    const action = vi.fn(ok);
    render(<ResumeUploadForm action={action} />);

    const png = new File([new Uint8Array([1, 2, 3])], "photo.png", {
      type: "image/png",
    });
    // applyAccept:false so the `accept` hint doesn't filter the file before our
    // own validation runs (a real user can still pick any file type).
    await userEvent.upload(screen.getByLabelText(/upload a pdf/i), png, {
      applyAccept: false,
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/pdf/i);
    expect(screen.getByRole("button", { name: /add resume/i })).toBeDisabled();
  });

  it("surfaces an error returned by the action", async () => {
    const action = vi.fn(
      async (): Promise<AddResumeState> => ({ error: "Something went wrong" }),
    );
    render(<ResumeUploadForm action={action} />);

    await userEvent.type(
      screen.getByLabelText(/paste your resume text/i),
      "text",
    );
    await userEvent.click(screen.getByRole("button", { name: /add resume/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong/i,
    );
  });
});

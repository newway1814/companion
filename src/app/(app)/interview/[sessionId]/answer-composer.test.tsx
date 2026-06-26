import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { AnswerComposer } from "./answer-composer";
import type { SpeechRecognitionLike, SubmitAnswerState } from "./types";

function makeRecognition(
  overrides: Partial<SpeechRecognitionLike> = {},
): SpeechRecognitionLike {
  return {
    lang: "",
    continuous: false,
    interimResults: false,
    start: vi.fn(),
    stop: vi.fn(),
    onresult: null,
    onerror: null,
    onend: null,
    ...overrides,
  };
}

describe("AnswerComposer", () => {
  it("submits a typed answer with its session/question context and duration", async () => {
    const action = vi.fn(
      async (_s: SubmitAnswerState, formData: FormData): Promise<SubmitAnswerState> => {
        expect(formData.get("transcript")).toBe("I owned the ingestion path.");
        expect(formData.get("sessionId")).toBe("sess-1");
        expect(formData.get("questionId")).toBe("q-1");
        expect(formData.get("durationSeconds")).not.toBeNull();
        return { ok: true };
      },
    );
    render(
      <AnswerComposer
        sessionId="sess-1"
        questionId="q-1"
        submitAction={action}
        speechSupported={false}
      />,
    );

    await userEvent.type(
      screen.getByLabelText(/your answer/i),
      "I owned the ingestion path.",
    );
    await userEvent.click(screen.getByRole("button", { name: /submit answer/i }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("always offers typed entry even when speech is unsupported", () => {
    render(
      <AnswerComposer
        sessionId="sess-1"
        questionId="q-1"
        submitAction={vi.fn(async (): Promise<SubmitAnswerState> => null)}
        speechSupported={false}
      />,
    );

    expect(screen.getByLabelText(/your answer/i)).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: /start speaking/i }),
    ).toBeNull();
  });

  it("recovers to typing when the microphone permission fails", async () => {
    const recognition = makeRecognition({
      start() {
        recognition.onerror?.({ error: "not-allowed" });
      },
    });
    render(
      <AnswerComposer
        sessionId="sess-1"
        questionId="q-1"
        submitAction={vi.fn(async (): Promise<SubmitAnswerState> => null)}
        speechSupported
        createRecognition={() => recognition}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /start speaking/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/microphone|type/i);
    // Typed entry remains the recovery path.
    expect(screen.getByLabelText(/your answer/i)).toBeEnabled();
  });

  it("indicates the listening state with text while recording", async () => {
    const recognition = makeRecognition();
    render(
      <AnswerComposer
        sessionId="sess-1"
        questionId="q-1"
        submitAction={vi.fn(async (): Promise<SubmitAnswerState> => null)}
        speechSupported
        createRecognition={() => recognition}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /start speaking/i }));

    expect(screen.getByText(/listening/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AnswerComposer
        sessionId="sess-1"
        questionId="q-1"
        submitAction={vi.fn(async (): Promise<SubmitAnswerState> => null)}
        speechSupported={false}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

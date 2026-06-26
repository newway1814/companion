"use client";

import { Loader2, Mic, MicOff, Square } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { ChallengeBanner } from "./challenge-banner";
import type { ChallengeView } from "./room-view";
import type {
  SpeechRecognitionFactory,
  SpeechRecognitionLike,
  SubmitAnswerAction,
} from "./types";

function defaultSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition,
  );
}

const defaultCreateRecognition: SpeechRecognitionFactory = () => {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike })
      .SpeechRecognition ??
    (
      window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      }
    ).webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
};

function micErrorMessage(error: string): string {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone access was blocked. Type your answer below instead.";
  }
  return "The microphone stopped working. Type your answer below instead.";
}

export function AnswerComposer({
  sessionId,
  questionId,
  submitAction,
  challenge = null,
  speechSupported = defaultSpeechSupported(),
  createRecognition = defaultCreateRecognition,
}: {
  sessionId: string;
  questionId: string;
  submitAction: SubmitAnswerAction;
  challenge?: ChallengeView | null;
  speechSupported?: boolean;
  createRecognition?: SpeechRecognitionFactory;
}) {
  const [transcript, setTranscript] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [micError, setMicError] = React.useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = React.useState(0);
  const [state, formAction, pending] = React.useActionState(submitAction, null);

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const startedAtRef = React.useRef<number | null>(null);
  const baseTranscriptRef = React.useRef("");

  // Tracks answer length from the first input/utterance. Updated in event
  // handlers (never during render) so the hidden field stays a pure value.
  function touchDuration() {
    startedAtRef.current ??= Date.now();
    setDurationSeconds(Math.round((Date.now() - startedAtRef.current) / 1000));
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function startListening() {
    const recognition = createRecognition();
    if (!recognition) {
      setMicError(micErrorMessage("unsupported"));
      return;
    }
    recognitionRef.current = recognition;
    baseTranscriptRef.current = transcript ? `${transcript} ` : "";
    let erroredSynchronously = false;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0]?.transcript ?? "";
      }
      setTranscript(`${baseTranscriptRef.current}${text}`.trimStart());
      touchDuration();
    };
    recognition.onerror = (event) => {
      erroredSynchronously = true;
      setListening(false);
      setMicError(micErrorMessage(event.error));
    };
    recognition.onend = () => setListening(false);

    setMicError(null);
    try {
      // start() may synchronously surface a permission error via onerror.
      recognition.start();
      if (!erroredSynchronously) {
        setListening(true);
        touchDuration();
      }
    } catch {
      setListening(false);
      setMicError(micErrorMessage("failed"));
    }
  }

  const error = state && "error" in state ? state.error : null;

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col rounded-xl border border-outline-variant bg-surface-container-lowest"
    >
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="durationSeconds" value={durationSeconds} />

      {challenge ? (
        <div className="p-4 pb-0">
          <ChallengeBanner
            challenge={challenge}
            onUseChip={(chip) => {
              setTranscript((prev) => (prev ? `${prev}\n${chip}: ` : `${chip}: `));
              touchDuration();
            }}
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-b border-outline-variant bg-surface px-4 py-3">
        <label
          htmlFor="answer-transcript"
          className="text-label-caps uppercase tracking-wide text-on-surface-variant"
        >
          Your answer
        </label>
        {speechSupported ? (
          listening ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={stopListening}
            >
              <Square className="size-4" aria-hidden="true" />
              Stop
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={startListening}
            >
              <Mic className="size-4" aria-hidden="true" />
              Start speaking
            </Button>
          )
        ) : (
          <span className="flex items-center gap-1.5 text-label-caps uppercase tracking-wide text-on-surface-variant">
            <MicOff className="size-4" aria-hidden="true" />
            Type your answer
          </span>
        )}
      </div>

      <textarea
        id="answer-transcript"
        name="transcript"
        value={transcript}
        onChange={(event) => {
          setTranscript(event.target.value);
          touchDuration();
        }}
        placeholder="Answer with specifics — your contribution, the method, tradeoffs, and measured results."
        className="min-h-48 flex-1 resize-none bg-transparent p-6 text-body-lg text-on-surface placeholder:text-outline focus:outline-none"
      />

      <div
        aria-live="polite"
        className="flex min-h-6 items-center gap-2 px-6 text-label-caps uppercase tracking-wide text-primary"
      >
        {listening ? (
          <span role="status" className="flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            Listening…
          </span>
        ) : null}
      </div>

      {micError ? (
        <p role="alert" className="px-6 pb-2 text-body-md text-on-error-container">
          {micError}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="px-6 pb-2 text-body-md text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-outline-variant bg-surface px-4 py-3">
        <span className="text-mono-label text-on-surface-variant">
          Speech-first · typing always works
        </span>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {pending ? "Saving…" : "Submit answer"}
        </Button>
      </div>
    </form>
  );
}

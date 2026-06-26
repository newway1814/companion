export type SubmitAnswerState = { ok: true } | { error: string } | null;

export type SubmitAnswerAction = (
  state: SubmitAnswerState,
  formData: FormData,
) => Promise<SubmitAnswerState>;

/** Minimal shape of the Web Speech API recognition we depend on. */
export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export type SpeechRecognitionFactory = () => SpeechRecognitionLike | null;

export type GenerateReportState = { ok: true } | { error: string } | null;

export type GenerateReportAction = (
  state: GenerateReportState,
  formData: FormData,
) => Promise<GenerateReportState>;

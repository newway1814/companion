import { extractText, getDocumentProxy } from "unpdf";

/** Extracts plain text from a PDF byte buffer. */
export async function extractPdfText(data: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return text.trim();
}

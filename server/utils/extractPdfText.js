import { PDFParse } from "pdf-parse";

/**
 * Extract plain text from a PDF buffer (pdf-parse 2.x / pdf.js).
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function extractPdfTextFromBuffer(buffer) {
  if (!buffer || !buffer.length) return "";
  const parser = new PDFParse({ data: buffer });
  try {
    const textResult = await parser.getText();
    return textResult.text || "";
  } finally {
    try {
      await parser.destroy();
    } catch {
      /* ignore */
    }
  }
}

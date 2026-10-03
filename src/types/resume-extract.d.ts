declare module "pdf-parse" {
  interface PdfParseResult {
    text: string;
    numpages: number;
    info?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
  function pdfParse(data: Buffer | Uint8Array): Promise<PdfParseResult>;
  export default pdfParse;
}

declare module "mammoth" {
  interface ExtractResult {
    value: string;
    messages: { type: string; message: string }[];
  }
  interface ExtractOptions {
    buffer?: Buffer;
    arrayBuffer?: ArrayBuffer;
    path?: string;
  }
  export function extractRawText(options: ExtractOptions): Promise<ExtractResult>;
  export function convertToHtml(options: ExtractOptions): Promise<ExtractResult>;
}

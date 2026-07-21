import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import * as XLSX from "xlsx";
import { Document } from "@langchain/core/documents";
import { convert } from "html-to-text";
import fs from "fs";
import path from "path";
import os from "os";

/** File extensions that we handle as binary downloads instead of HTML scraping */
const DOCUMENT_EXTENSIONS = new Set([
  ".pdf",
  ".csv",
  ".docx",
  ".txt",
  ".md",
  ".xlsx",
  ".xls",
  ".html",
  ".htm",
]);

/**
 * Downloads a remote URL to a temp file and returns its local path.
 * The temp file is cleaned up by the OS; call `fs.unlinkSync` if you need
 * immediate cleanup.
 */
async function downloadToTemp(url: string, ext: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download document (${response.status}): ${url}`,
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const tmpPath = path.join(os.tmpdir(), `langchain-doc-${Date.now()}${ext}`);
  fs.writeFileSync(tmpPath, buffer);
  return tmpPath;
}

async function loadAnyDocument(source: string) {
  // ── Remote URL ──────────────────────────────────────────────────────────────
  if (/^https?:\/\//.test(source)) {
    // Strip query-string / fragment before checking extension (Cloudinary URLs
    // often end with ?version=... or similar parameters).
    const cleanPath = new URL(source).pathname;
    const ext = path.extname(cleanPath).toLowerCase();

    if (DOCUMENT_EXTENSIONS.has(ext)) {
      // Download the binary file then re-use the local-file branches below.
      const tmpPath = await downloadToTemp(source, ext);
      try {
        return await loadLocalFile(tmpPath, ext, source);
      } finally {
        // Best-effort cleanup
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          // ignore
        }
      }
    }

    // Fall back to HTML scraping for plain web pages
    const loader = new CheerioWebBaseLoader(source);
    return loader.load();
  }

  // ── Local file ──────────────────────────────────────────────────────────────
  const ext = path.extname(source).toLowerCase();
  return loadLocalFile(source, ext, source);
}

async function loadLocalFile(
  filePath: string,
  ext: string,
  originalSource: string,
) {
  switch (ext) {
    case ".pdf":
      return new PDFLoader(filePath).load();

    case ".csv":
      return new CSVLoader(filePath).load();

    case ".docx":
      return new DocxLoader(filePath).load();

    case ".txt":
    case ".md": {
      const text = fs.readFileSync(filePath, "utf-8");
      return [
        new Document({ pageContent: text, metadata: { source: originalSource } }),
      ];
    }

    case ".xlsx":
    case ".xls": {
      const workbook = XLSX.readFile(filePath);
      const docs = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName]!;
        const text = XLSX.utils.sheet_to_csv(sheet);
        return new Document({
          pageContent: text,
          metadata: { source: originalSource, sheetName },
        });
      });
      return docs;
    }

    case ".html":
    case ".htm": {
      const raw = fs.readFileSync(filePath, "utf-8");
      const text = convert(raw, { wordwrap: false });
      return [
        new Document({ pageContent: text, metadata: { source: originalSource } }),
      ];
    }

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

export default loadAnyDocument;

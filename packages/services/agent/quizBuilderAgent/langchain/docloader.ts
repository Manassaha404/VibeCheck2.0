// review needed (add a ocr loader for scanned pdf)
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

async function downloadToTemp(url: string, ext: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download document (${response.status}): ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const tmpPath = path.join(os.tmpdir(), `langchain-doc-${Date.now()}${ext}`);
  fs.writeFileSync(tmpPath, buffer);
  return tmpPath;
}

async function loadAnyDocument(source: string) {
  if (/^https?:\/\//.test(source)) {
    const cleanPath = new URL(source).pathname;
    const ext = path.extname(cleanPath).toLowerCase();

    if (DOCUMENT_EXTENSIONS.has(ext)) {
      const tmpPath = await downloadToTemp(source, ext);
      try {
        return await loadLocalFile(tmpPath, ext, source);
      } finally {
        try {
          fs.unlinkSync(tmpPath);
        } catch {}
      }
    }
    const loader = new CheerioWebBaseLoader(source);
    return loader.load();
  }
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
        new Document({
          pageContent: text,
          metadata: { source: originalSource },
        }),
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
        new Document({
          pageContent: text,
          metadata: { source: originalSource },
        }),
      ];
    }

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

export default loadAnyDocument;

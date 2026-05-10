import multer from "multer";

const FIVE_MB = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

function pdfFileFilter(req, file, cb) {
  const name = (file.originalname || "").toLowerCase();
  const mime = file.mimetype || "";
  const okExt = name.endsWith(".pdf");
  const okMime =
    mime === "application/pdf" ||
    mime === "application/x-pdf" ||
    (mime === "application/octet-stream" && okExt);
  if (okMime || okExt) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
}

export const uploadNlpPdf = multer({
  storage,
  limits: { fileSize: FIVE_MB },
  fileFilter: pdfFileFilter,
});

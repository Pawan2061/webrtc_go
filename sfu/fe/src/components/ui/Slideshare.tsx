"use client";
import React, { useState } from "react";
import { PDFUploader } from "./PdfUploader";
import WebSocketPDFViewer from "../Pdf";
import { root } from "postcss";

const PDFSlideshare = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  const handleUploadSuccess = (uploadedFileUrl: string) => {
    console.log("im here boy");
    console.log(uploadedFileUrl);

    setPdfFile(uploadedFileUrl);
  };

  return (
    <div className="pdf-slideshare">
      {!pdfFile ? (
        <PDFUploader onUploadSuccess={handleUploadSuccess} />
      ) : (
        <WebSocketPDFViewer pdfFile={pdfFile} />
      )}
    </div>
  );
};

export default PDFSlideshare;

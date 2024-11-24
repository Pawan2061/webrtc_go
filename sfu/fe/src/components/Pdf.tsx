"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface WebSocketPDFViewerProps {
  pdfFile: string;
}

const WebSocketPDFViewer: React.FC<WebSocketPDFViewerProps> = ({ pdfFile }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  const changePage = (offset: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + offset, 1), totalPages));
  };

  const fullPdfUrl = `http://localhost:8080/uploads/${pdfFile}`;
  console.log(fullPdfUrl, "pdf here");

  return (
    <div className="pdf-viewer container mx-auto w-[400px] h-[400px]">
      <Document
        file={fullPdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex justify-center"
      >
        <Page
          pageNumber={currentPage}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          width={window.innerWidth * 0.8}
        />
      </Document>

      <div className="pdf-controls flex justify-between items-center mt-4">
        <button
          onClick={() => changePage(-1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => changePage(1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WebSocketPDFViewer;

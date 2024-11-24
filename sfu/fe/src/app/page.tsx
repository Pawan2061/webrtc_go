import Landing from "@/components/Landing";
import PDFUploader from "@/components/Pdf";
import WebSocketPDFViewer from "@/components/Pdf";
import AuthModal from "@/components/ui/dummy";
import Navbar from "@/components/ui/Navbar";
import PDFSlideshare from "@/components/ui/Slideshare";

export default function App() {
  return (
    <div>
      <Navbar />
      <Landing />
      {/* <AuthModal /> */}
      {/* <PDFSlideshare /> */}
    </div>
  );
}

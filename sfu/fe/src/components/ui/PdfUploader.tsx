import axios from "axios";
export const PDFUploader = ({
  onUploadSuccess,
}: {
  onUploadSuccess: (url: string) => void;
}) => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);

      onUploadSuccess(response.data.filename);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="pdf-uploader">
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
    </div>
  );
};

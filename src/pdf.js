import { useEffect, useState } from "react";
import ReportsAPI from "./services/connections/reportsapi";

const PDF = () => {
  const [pdfDataUri, setPdfDataUri] = useState(null);

  useEffect(() => {
    ReportsAPI.get("/outlet/print")
      .then(({ data }) => {
        console.log(data, "uri");
        setPdfDataUri(data);
      })
      .catch((error) => {
        console.error("Error fetching PDF data:", error);
      });
  }, []);

  const handleDownload = () => {
    // Trigger the download by creating a link element
    const link = document.createElement("a");
    link.href = ReportsAPI.get("/outlet/pdf");
    link.download = "generated.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={handleDownload}>Download PDF</button>
      <h1>PDF Viewer</h1>
      {pdfDataUri ? (
        <iframe
          src={pdfDataUri}
          title="PDF Viewer"
          width="100%"
          height="500px" // Adjust the height as needed
        ></iframe>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};
export default PDF;

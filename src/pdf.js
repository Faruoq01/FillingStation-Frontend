import { useEffect, useState } from "react";

const PDF = () => {
  const [pdfDataUri, setPdfDataUri] = useState(null);

  useEffect(() => {
    // Fetch the PDF data URI from the server
    fetch("http://localhost:5000/generate-print") // Replace with your server's URL
      .then((response) => response.text())
      .then((dataUri) => {
        // Set the data URI in the component state
        setPdfDataUri(dataUri);
      })
      .catch((error) => {
        console.error("Error fetching PDF data:", error);
      });
  }, []);

  const handleDownload = () => {
    // Trigger the download by creating a link element
    const link = document.createElement("a");
    link.href = "http://localhost:5000/generate-pdf";
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

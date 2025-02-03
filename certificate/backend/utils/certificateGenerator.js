const PDFDocument = require("pdfkit");

const generateCertificate = async (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
      });

      // Collect the PDF data chunks
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Add content to PDF
      const fontMap = {
        helvetica: "Helvetica",
        times: "Times-Roman",
        georgia: "Georgia",
        calibri: "Calibri",
        palatino: "Palatino",
      };

      const selectedFont = fontMap[certificateData.fontStyle] || "Helvetica";

      doc
        .font(`${selectedFont}-Bold`)
        .fontSize(30)
        .text("Certificate of Completion", 0, 100, { align: "center" });

      // Add recipient photo if provided
      if (certificateData.photo) {
        try {
          const photoData = certificateData.photo.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const photoBuffer = Buffer.from(photoData, "base64");
          doc.image(photoBuffer, 450, 50, {
            width: 100,
            height: 120,
            align: "right",
          });
        } catch (error) {
          console.error("Error adding photo to certificate:", error);
        }
      }

      doc
        .fontSize(20)
        .text(`This is to certify that`, 0, 180, { align: "center" });

      doc
        .fontSize(25)
        .text(certificateData.recipientName, 0, 220, { align: "center" });

      doc.fontSize(20).text(`has successfully completed the course`, 0, 260, {
        align: "center",
      });

      doc
        .fontSize(25)
        .text(certificateData.courseName, 0, 300, { align: "center" });

      // Add appreciation text if provided
      if (certificateData.appreciationText) {
        doc
          .font(`${selectedFont}-Italic`)
          .fontSize(14)
          .text(certificateData.appreciationText, 100, 350, {
            align: "center",
            width: doc.page.width - 200,
            lineGap: 2,
          });
      }

      doc
        .fontSize(15)
        .text(`Certificate ID: ${certificateData.certificateId}`, 50, 400);

      doc
        .fontSize(15)
        .text(
          `Verification Code: ${certificateData.verificationCode}`,
          50,
          430
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;

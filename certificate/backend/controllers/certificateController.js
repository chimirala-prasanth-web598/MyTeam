const Certificate = require("../models/Certificate");
const generateCertificate = require("../utils/certificateGenerator");

exports.generateCertificate = async (req, res) => {
  try {
    const { category, recipientName, courseName } = req.body;

    // Generate unique certificate ID and verification code
    const certificateId = `CERT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const verificationCode = Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase();

    // Create certificate in database
    const certificate = await Certificate.create({
      certificateId,
      category,
      recipientName,
      courseName,
      verificationCode,
      templateUsed: `${category}-template`,
    });

    // Generate certificate PDF
    const pdfBuffer = await generateCertificate(certificate);

    res.status(201).json({
      success: true,
      data: certificate,
      pdf: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { verificationCode } = req.params;
    const certificate = await Certificate.findOne({ verificationCode });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

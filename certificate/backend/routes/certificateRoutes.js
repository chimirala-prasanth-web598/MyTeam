const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const generateCertificate = require("../utils/certificateGenerator");

// Generate certificate
router.post("/generate", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      year,
      recipientName,
      courseName,
      appreciationText,
      fontStyle,
      background,
      photo,
    } = req.body;

    // Generate unique certificate ID and verification code
    const certificateId = `CERT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const verificationCode = Math.random()
      .toString(36)
      .substr(2, 10)
      .toUpperCase();

    // Create new certificate document
    const certificate = new Certificate({
      certificateId,
      category,
      subcategory,
      year,
      recipientName,
      courseName,
      appreciationText,
      fontStyle,
      background,
      photo,
      verificationCode,
      templateUsed: "standard",
    });

    // Save certificate to database
    await certificate.save();

    // Generate PDF
    const pdfBuffer = await generateCertificate({
      ...certificate.toObject(),
      photo: photo || null,
    });

    // Convert PDF buffer to base64
    const pdfBase64 = pdfBuffer.toString("base64");

    res.json({
      success: true,
      data: {
        certificateId,
        verificationCode,
      },
      pdf: pdfBase64,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate certificate",
    });
  }
});

// Verify certificate
router.get("/verify/:certificateId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found",
      });
    }

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to verify certificate",
    });
  }
});

// Email certificate
router.post("/email", async (req, res) => {
  try {
    const { certificateId, email } = req.body;

    // Add email sending logic here
    // This is a placeholder for now
    res.json({
      success: true,
      message: "Certificate sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to send certificate",
    });
  }
});

module.exports = router;

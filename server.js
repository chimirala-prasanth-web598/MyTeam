const express = require('express');
const path = require('path');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/templates', express.static('templates'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/certificateHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
    name: String,
    email: String,
    category: String,
    certificateId: String,
    issueDate: Date,
    templateId: String
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});

// Routes
app.post('/api/generate-certificate', upload.single('logo'), async (req, res) => {
    try {
        const { name, email, category, templateId } = req.body;
        const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create new certificate document
        const certificate = new Certificate({
            name,
            email,
            category,
            certificateId,
            issueDate: new Date(),
            templateId
        });

        await certificate.save();

        // Generate PDF certificate
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: { top: 0, bottom: 0, left: 0, right: 0 }
        });

        // Create write stream for PDF
        const pdfPath = `./uploads/${certificateId}.pdf`;
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        // Add background based on template
        const templatePath = `./templates/backgrounds/${templateId}.png`;
        doc.image(templatePath, 0, 0, { width: 842, height: 595 }); // A4 landscape dimensions

        // Add logo if provided
        if (req.file) {
            doc.image(req.file.path, 50, 50, { width: 100 });
        }

        // Add certificate content with styling
        doc.font('templates/fonts/Montserrat-Bold.ttf')
           .fontSize(40)
           .fillColor('#1a237e')
           .text('Certificate of Achievement', 0, 150, { align: 'center' });

        doc.font('templates/fonts/Montserrat-Regular.ttf')
           .fontSize(25)
           .fillColor('#333')
           .text('This is to certify that', 0, 220, { align: 'center' });

        doc.font('templates/fonts/Montserrat-Bold.ttf')
           .fontSize(35)
           .fillColor('#1a237e')
           .text(name, 0, 270, { align: 'center' });

        doc.font('templates/fonts/Montserrat-Regular.ttf')
           .fontSize(25)
           .fillColor('#333')
           .text(`has successfully completed the`, 0, 320, { align: 'center' })
           .text(`${category} certification`, 0, 355, { align: 'center' });

        // Add date
        const date = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        doc.fontSize(15)
           .text(`Issued on ${date}`, 0, 420, { align: 'center' });

        // Add signature images
        doc.image('templates/signatures/director.png', 200, 450, { width: 150 });
        doc.image('templates/signatures/registrar.png', 500, 450, { width: 150 });

        // Add signature labels
        doc.fontSize(12)
           .text('Director', 200, 500, { width: 150, align: 'center' })
           .text('Registrar', 500, 500, { width: 150, align: 'center' });

        // Add certificate ID and QR code
        const QRCode = require('qrcode');
        const qrCodePath = `./uploads/qr-${certificateId}.png`;
        await QRCode.toFile(qrCodePath, `https://your-domain.com/verify/${certificateId}`);
        
        doc.image(qrCodePath, 700, 50, { width: 80 })
           .fontSize(10)
           .text(`Certificate ID: ${certificateId}`, 680, 140, { width: 120, align: 'center' });

        doc.end();

        // Wait for PDF to be created
        writeStream.on('finish', async () => {
            // Send email with certificate
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Your Certificate',
                html: `
                    <h1>Congratulations ${name}!</h1>
                    <p>Your certificate has been generated successfully.</p>
                    <p>Certificate ID: ${certificateId}</p>
                    <p>You can verify your certificate at: https://your-domain.com/verify/${certificateId}</p>
                `,
                attachments: [{
                    filename: 'certificate.pdf',
                    path: pdfPath
                }]
            };

            await transporter.sendMail(mailOptions);

            // Send preview URL to client
            res.status(200).json({
                success: true,
                certificateId,
                previewUrl: `/preview/${certificateId}`,
                downloadUrl: `/download/${certificateId}`,
                message: 'Certificate generated and sent successfully'
            });

            // Clean up temporary files
            fs.unlinkSync(qrCodePath);
            if (req.file) fs.unlinkSync(req.file.path);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error generating certificate'
        });
    }
});

// Verify certificate
app.get('/api/verify/:certificateId', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        res.status(200).json({
            success: true,
            certificate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error verifying certificate'
        });
    }
});

// Add template selection route
app.get('/api/templates', (req, res) => {
    const templates = [
        {
            id: 'template1',
            name: 'Classic Blue',
            preview: '/templates/previews/template1.png'
        },
        {
            id: 'template2',
            name: 'Modern Gold',
            preview: '/templates/previews/template2.png'
        },
        {
            id: 'template3',
            name: 'Professional Dark',
            preview: '/templates/previews/template3.png'
        }
    ];
    res.json(templates);
});

// Add preview route
app.get('/preview/:certificateId', async (req, res) => {
    const certificateId = req.params.certificateId;
    const pdfPath = `./uploads/${certificateId}.pdf`;
    
    if (fs.existsSync(pdfPath)) {
        res.sendFile(pdfPath, { root: '.' });
    } else {
        res.status(404).send('Certificate not found');
    }
});

// Add download route
app.get('/download/:certificateId', async (req, res) => {
    const certificateId = req.params.certificateId;
    const pdfPath = `./uploads/${certificateId}.pdf`;
    
    if (fs.existsSync(pdfPath)) {
        res.download(pdfPath);
    } else {
        res.status(404).send('Certificate not found');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
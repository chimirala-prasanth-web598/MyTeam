const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const Certificate = require('./models/Certificate');
const MockTest = require('./models/MockTest');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define certificate templates
const certificateTemplates = {
    'elegant-gold': {
        name: 'Elegant Gold',
        style: {
            background: '#f9f6f0',
            border: '#d4af37',
            font: 'Times-Roman'
        }
    },
    'modern-blue': {
        name: 'Modern Blue',
        style: {
            background: '#f5f7fa',
            border: '#4a90e2',
            font: 'Helvetica'
        }
    },
    'classic-red': {
        name: 'Classic Red',
        style: {
            background: '#ffffff',
            border: '#8b0000',
            font: 'Times-Roman'
        }
    },
    'minimalist': {
        name: 'Minimalist',
        style: {
            background: '#ffffff',
            border: '#333333',
            font: 'Helvetica'
        }
    }
};

// Health check endpoint
app.get('/api/health-check', (req, res) => {
    try {
        res.json({
            status: 'ok',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Add MongoDB connection status check
app.get('/api/db-status', (req, res) => {
    try {
        const status = mongoose.connection.readyState;
        const statusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        res.json({
            status: 'ok',
            database: {
                status: statusMap[status],
                host: mongoose.connection.host,
                name: mongoose.connection.name
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Certificate generation endpoint
app.post('/api/certificates/generate', async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const { name, category, score, templateId } = req.body;

        // Validate input
        if (!name || !category || !score || !templateId) {
            console.log('Missing fields:', { name, category, score, templateId });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Generate unique certificate ID
        const certificateId = uuidv4();
        const fileName = `certificate-${certificateId}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape'
        });

        // Pipe PDF to file
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        try {
            // Add certificate content
            doc.font('Helvetica-Bold')
               .fontSize(40)
               .text('Certificate of Achievement', { align: 'center', y: 150 });

            doc.font('Helvetica')
               .fontSize(25)
               .moveDown()
               .text('This certifies that', { align: 'center' });

            doc.font('Helvetica-Bold')
               .fontSize(30)
               .moveDown()
               .text(name, { align: 'center' });

            doc.font('Helvetica')
               .fontSize(25)
               .moveDown()
               .text(`has successfully completed the ${category}`, { align: 'center' });

            doc.moveDown()
               .text(`with a score of ${score}%`, { align: 'center' });

            // Add date
            const date = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            doc.fontSize(15)
               .moveDown(2)
               .text(`Issued on ${date}`, { align: 'center' });

            // Add signature lines
            doc.fontSize(15)
               .moveDown(2);

            doc.text('_____________________', 200, 500)
               .text('Director', 200, 520);

            doc.text('_____________________', 500, 500)
               .text('Administrator', 500, 520);

            // Finalize PDF
            doc.end();

            // Wait for PDF to be written
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            // Create URLs
            const previewUrl = `/certificates/${fileName}`;
            const downloadUrl = `/api/certificates/download/${fileName}`;

            // Save to database
            const certificate = new Certificate({
                certificateId,
                name,
                category,
                score,
                templateId,
                previewUrl,
                downloadUrl
            });

            await certificate.save();

            // Send response
            res.json({
                success: true,
                certificateId,
                previewUrl,
                downloadUrl
            });

        } catch (pdfError) {
            console.error('PDF generation error:', pdfError);
            // Clean up incomplete file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw pdfError;
        }

    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate certificate',
            details: error.message
        });
    }
});

// Mock Test Routes
app.get('/api/mock-tests', async (req, res) => {
    try {
        const mockTests = await MockTest.find();
        res.json(mockTests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch mock tests' });
    }
});

app.post('/api/mock-tests/start', async (req, res) => {
    try {
        const { testId } = req.body;
        const mockTest = await MockTest.findById(testId);
        
        if (!mockTest) {
            return res.status(404).json({ error: 'Mock test not found' });
        }

        mockTest.status = 'in_progress';
        mockTest.progress = 0;
        await mockTest.save();

        res.json(mockTest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to start mock test' });
    }
});

app.post('/api/mock-tests/submit', async (req, res) => {
    try {
        const { testId, answers } = req.body;
        const mockTest = await MockTest.findById(testId);
        
        if (!mockTest) {
            return res.status(404).json({ error: 'Mock test not found' });
        }

        // Calculate score based on answers
        const score = calculateScore(answers); // Implement this function based on your scoring logic

        mockTest.status = 'completed';
        mockTest.progress = 100;
        mockTest.score = score;
        await mockTest.save();

        res.json(mockTest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit mock test' });
    }
});

// Certificate verification endpoint
app.get('/api/certificates/verify/:certificateId', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ 
            certificateId: req.params.certificateId 
        });

        if (!certificate) {
            return res.json({
                success: false,
                error: 'Certificate not found'
            });
        }

        res.json({
            success: true,
            certificate: {
                id: certificate.certificateId,
                name: certificate.name,
                category: certificate.category,
                score: certificate.score,
                issueDate: certificate.issueDate,
                verified: true
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to verify certificate'
        });
    }
});

// Download endpoint
app.get('/api/certificates/download/:fileName', (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(uploadsDir, fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Certificate not found'
            });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to download certificate'
        });
    }
});

// Serve static files from uploads directory
app.use('/certificates', express.static(uploadsDir));

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: err.message
    });
});

const PORT = 3000;

// Before starting the server, check if port 3000 is in use
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop any other server running on port 3000`);
        process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
}); 
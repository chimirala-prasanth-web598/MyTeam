const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    templateId: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    downloadUrl: String,
    previewUrl: String
});

module.exports = mongoose.model('Certificate', certificateSchema); 
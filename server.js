const express = require('express');
const multer = require('multer');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const XLSX = require('xlsx');
const Jimp = require('jimp');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any domain
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/convert', upload.single('file'), async (req, res) => {
    const conversionType = req.body.conversionType;
    const filePath = req.file.path;

    try {
        let outputFilePath;

        switch (conversionType) {
            case 'pdfToExcel':
                outputFilePath = await convertPdfToExcel(filePath);
                break;
            case 'excelToPdf':
                outputFilePath = await convertExcelToPdf(filePath);
                break;
            case 'pdfToWord':
                outputFilePath = await convertPdfToWord(filePath);
                break;
            case 'wordToJpg':
                outputFilePath = await convertWordToJpg(filePath);
                break;
            case 'wordToExcel':
                outputFilePath = await convertWordToExcel(filePath);
                break;
            case 'jpgToExcel':
                outputFilePath = await convertJpgToExcel(filePath);
                break;
            default:
                throw new Error('Invalid conversion type');
        }

        res.download(outputFilePath, `converted_file.${getFileExtension(conversionType)}`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error during conversion.');
            }
            // Clean up temporary files
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputFilePath);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during conversion.');
    }
});

// Conversion functions (placeholders - implement as needed)
async function convertPdfToExcel(filePath) {
    // Implement PDF to Excel conversion logic
    return 'converted_file.xlsx';
}

async function convertExcelToPdf(filePath) {
    // Implement Excel to PDF conversion logic
    return 'converted_file.pdf';
}

async function convertPdfToWord(filePath) {
    // Implement PDF to Word conversion logic
    return 'converted_file.docx';
}

async function convertWordToJpg(filePath) {
    // Implement Word to JPG conversion logic
    return 'converted_file.jpg';
}

async function convertWordToExcel(filePath) {
    // Implement Word to Excel conversion logic
    return 'converted_file.xlsx';
}

async function convertJpgToExcel(filePath) {
    // Implement JPG to Excel conversion logic
    return 'converted_file.xlsx';
}

function getFileExtension(conversionType) {
    switch (conversionType) {
        case 'pdfToExcel':
            return 'xlsx';
        case 'excelToPdf':
            return 'pdf';
        case 'pdfToWord':
            return 'docx';
        case 'wordToJpg':
            return 'jpg';
        case 'wordToExcel':
            return 'xlsx';
        case 'jpgToExcel':
            return 'xlsx';
        default:
            return 'txt';
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Added CORS
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const XLSX = require('xlsx');
const Jimp = require('jimp');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS
app.use(cors());

// Root route to fix 404 error
app.get("/", (req, res) => {
    res.send("Backend is running! Use /convert to process files.");
});

// File conversion endpoint
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
            if (err) console.error('Error sending file:', err);
            // Clean up files
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputFilePath);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Conversion failed');
    }
});

// Conversion functions (add your logic here)
async function convertPdfToExcel(filePath) { return 'converted.xlsx'; }
async function convertExcelToPdf(filePath) { return 'converted.pdf'; }
async function convertPdfToWord(filePath) { return 'converted.docx'; }
async function convertWordToJpg(filePath) { return 'converted.jpg'; }
async function convertWordToExcel(filePath) { return 'converted.xlsx'; }
async function convertJpgToExcel(filePath) { return 'converted.xlsx'; }

function getFileExtension(conversionType) {
    const extensions = {
        pdfToExcel: 'xlsx',
        excelToPdf: 'pdf',
        pdfToWord: 'docx',
        wordToJpg: 'jpg',
        wordToExcel: 'xlsx',
        jpgToExcel: 'xlsx'
    };
    return extensions[conversionType] || 'txt';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
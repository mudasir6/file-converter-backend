const express = require('express');
const multer = require('multer');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib'); // Handle PDFs

const app = express();
const upload = multer({ dest: 'uploads/' }); // Set up file uploads

// Middleware to handle JSON requests
app.use(express.json());

// Example route for PDF to Excel conversion
app.post('/convert-pdf-to-excel', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Converted Data');

        // Dummy data as a placeholder for conversion logic
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Age', key: 'age', width: 10 }
        ];
        worksheet.addRow({ name: 'John Doe', age: 30 });

        const excelFilePath = path.join(__dirname, 'output', 'converted-file.xlsx');
        await workbook.xlsx.writeFile(excelFilePath);

        res.download(excelFilePath, (err) => {
            if (err) throw err;
            fs.unlinkSync(filePath); // Delete uploaded PDF
        });
    } catch (error) {
        res.status(500).send('Error converting PDF to Excel');
    }
});

// Example route for Excel to PDF conversion
app.post('/convert-excel-to-pdf', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);

        const pdfDoc = await PDFDocument.create();

        const page = pdfDoc.addPage([600, 400]);
        page.drawText('Excel to PDF Conversion Demo');

        const pdfFilePath = path.join(__dirname, 'output', 'converted-file.pdf');
        fs.writeFileSync(pdfFilePath, await pdfDoc.save());

        res.download(pdfFilePath, (err) => {
            if (err) throw err;
            fs.unlinkSync(filePath); // Delete uploaded Excel
        });
    } catch (error) {
        res.status(500).send('Error converting Excel to PDF');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

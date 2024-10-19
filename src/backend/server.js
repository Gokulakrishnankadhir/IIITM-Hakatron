import express from 'express';
import multer from 'multer';
import fs from 'fs';
import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Read students' data from the Excel file
    const students = readStudentsData(filePath);

    // Call sendEmails function with students data
    await sendEmails(students);

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).send('Certificates processed successfully!');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('An error occurred while processing the certificates.');
  }
});

// Function to read students' data from Excel
function readStudentsData(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

// Function to generate a certificate for a student
function generateCertificate(student) {
  return new Promise((resolve, reject) => {
    const certificatesDir = path.resolve(__dirname, 'certificates');

    // Ensure the certificates directory exists
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true }); // Creates the folder if it doesn't exist
    }

    const outputPath = path.resolve(certificatesDir, `${student.name}_certificate.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add content to the certificate
    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(`${student.name}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(20).text(`has successfully completed the course.`, { align: 'center' });
    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// Function to send email with the certificate attached
async function sendEmails(students) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (let student of students) {
    try {
      const certificatePath = await generateCertificate(student);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: 'Your Certificate',
        text: `Hello ${student.name}, here is your certificate.`,
        attachments: [
          {
            filename: `${student.name}_certificate.pdf`,
            path: certificatePath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${student.email}`);

      // Delete the certificate file after sending
      fs.unlinkSync(certificatePath);
    } catch (error) {
      console.error(`Error processing for ${student.name}:`, error);
    }
  }
}

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

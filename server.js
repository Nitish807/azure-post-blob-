// const cors = require('cors');
 
const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const cors = require('cors');
require('dotenv').config();
 
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: '*', // Allow all origins (or specify your frontend domain)
    methods: ['POST'], // Restrict to POST requests
}));
 
app.use(cors());
const upload = multer();
 
app.post('/upload', upload.single('file'), async (req, res) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerName = 'nodeblog'; // Replace with your container name
    const containerClient = blobServiceClient.getContainerClient(containerName);
 
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
 
    try {
        await blockBlobClient.upload(req.file.buffer, req.file.size);
        res.status(200).send({ message: 'Upload successful', url: blockBlobClient.url });
    } catch (error) {
        res.status(500).send({ error: 'Upload failed', details: error.message });
    }
});
 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
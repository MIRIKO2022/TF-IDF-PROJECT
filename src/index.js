import { processText, calculateTF, calculateIDF, getVector, cosineSimilarity } from './TF_IDF.js';
const fs = require('fs');
const path = require('./data');

// The directory where your files live
const DOCS_DIR = path.join(__dirname, 'documents');
console.log(`Loading documents from: ${DOCS_DIR}`);

function loadDocumentsFromDisk() {
    const corpus = [];
    
    // 1. Read all file names in the directory
    const files = fs.readdirSync(DOCS_DIR);

    // 2. Loop through each file
    files.forEach(file => {
        // Only process .txt files for simplicity
        if (path.extname(file) === '.txt') {
            const filePath = path.join(DOCS_DIR, file);
            
            // 3. Read the file's content
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            
            // 4. Push it into our array using the filename as the ID
            corpus.push({
                id: file, 
                text: fileContent
            });
        }
    });

    return corpus;
}
const realDocuments = loadDocumentsFromDisk();

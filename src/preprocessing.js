const fs = require('fs');
const path = require('path');

const DOCS_FOLDER = path.join(__dirname, '../data');

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'it', 'its', 'this', 'that', 'these', 'those', 'and', 'or',
  'but', 'not', 'as', 'if', 'then', 'than', 'so', 'yet', 'both',
  'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'only', 'same', 'also',
  'into', 'through', 'during', 'their', 'they', 'use', 'used', 'many',
  'one', 'two', 'about', 'up', 'out', 'there', 'who', 'which'
]);

function loadDocuments(folderPath = DOCS_FOLDER) {
  const documents = {};
  const files = fs.readdirSync(folderPath).filter((name) => name.endsWith('.txt'));

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    documents[file] = fs.readFileSync(fullPath, 'utf-8');
  }

  return documents;
}

function cleanText(text = '') {
  const lowered = text.toLowerCase();
  const noPunctuation = lowered.replace(/[^\w\s]/g, '');
  const noDigits = noPunctuation.replace(/\d+/g, '');

  return noDigits
    .split(/\s+/)
    .filter((word) => word.trim() !== '')
    .filter((word) => !STOP_WORDS.has(word))
    .filter((word) => word.length >= 3);
}

function buildCleanedDocuments(documents) {
  const cleaned = {};
  for (const [filename, text] of Object.entries(documents)) {
    cleaned[filename] = cleanText(text);
  }
  return cleaned;
}

const documents = loadDocuments();
const cleanedDocuments = buildCleanedDocuments(documents);

module.exports = {
  STOP_WORDS,
  DOCS_FOLDER,
  loadDocuments,
  cleanText,
  buildCleanedDocuments,
  documents,
  cleanedDocuments
};
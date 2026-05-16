// /**
//  * TF-IDF Search Engine Project
//  * Steps covered:
//  *   1. Scan and read documents from external .txt files
//  *   2. Process and clean the text
//  */

// const fs   = require("fs");
// const path = require("path");

// // ============================================================
// // STEP 1: Scan and Read Documents from External .txt Files
// // ============================================================
// // Define the folder where the .txt documents are stored
// // Make sure doc1.txt ... doc5.txt are in the same folder as this script
// const DOCS_FOLDER = path.join(__dirname, '../data');

// /**
//  * Reads all .txt files from the given folder.
//  * Returns an object: { filename: rawTextContent, ... }
//  */
// function loadDocuments(folderPath) {
//   const documents = {};

//   // Get all files in the folder and keep only .txt files
//   const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".txt"));

//   if (files.length === 0) {
//     console.error("No .txt files found in folder:", folderPath);
//     process.exit(1);
//   }

//   // Read each file and store its content
//   for (const file of files) {
//     const fullPath = path.join(folderPath, file);
//     const content  = fs.readFileSync(fullPath, "utf-8");
//     documents[file] = content;
//     console.log(`  Loaded: ${file} (${content.split(/\s+/).length} words)`);
//   }

//   return documents;
// }

console.log("=".repeat(60));
console.log("STEP 1: Loading Documents from Files");
console.log("=".repeat(60));

// const documents = loadDocuments(DOCS_FOLDER);

// console.log(`\nTotal documents loaded: ${Object.keys(documents).length}`);

// ============================================================
// STEP 2: Process and Clean the Text
// ============================================================

// --- Stop Words List ---
// Stop words are very common words that are not useful for searching
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "may", "might", "shall", "can",
  "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "it", "its", "this", "that", "these", "those", "and", "or",
  "but", "not", "as", "if", "then", "than", "so", "yet", "both",
  "either", "neither", "each", "every", "all", "any", "few", "more",
  "most", "other", "some", "such", "no", "only", "same", "also",
  "into", "through", "during", "their", "they", "use", "used", "many",
  "one", "two", "also", "about", "up", "out", "there", "who", "which",
]);

/**
 * Function to fully clean and process a given text.
 * Returns the cleaned text as an array of tokens (words).
 */
function cleanText(text) {

  // --- Step 1: Convert all characters to lowercase ---
  text = text.toLowerCase();

  // --- Step 2: Remove punctuation and special characters ---
  text = text.replace(/[^\w\s]/g, "");   // removes anything that is not a letter or space

  // --- Step 3: Remove digits ---
  text = text.replace(/\d+/g, "");

  // --- Step 4: Tokenization - split the text into individual words ---
  let tokens = text.split(/\s+/);

  // --- Step 5: Remove empty strings after splitting ---
  tokens = tokens.filter((word) => word.trim() !== "");

  // --- Step 6: Remove Stop Words ---
  tokens = tokens.filter((word) => !STOP_WORDS.has(word));

  // --- Step 7: Remove very short words (less than 3 characters) ---
  tokens = tokens.filter((word) => word.length >= 3);

  return tokens;
}

// --- Apply cleaning to all loaded documents ---
console.log("\n" + "=".repeat(60));
console.log("STEP 2: Cleaned Text / Tokens");
console.log("=".repeat(60));

const cleanedDocuments = {};

for (const [filename, text] of Object.entries(documents)) {
  const tokens = cleanText(text);
  cleanedDocuments[filename] = tokens;

  console.log(`\n[${filename}] -> ${tokens.length} tokens after cleaning:`);
  console.log(tokens.slice(0, 15).join(", ") + " ...");  // preview first 15 tokens
}

// ============================================================
// SUMMARY
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("SUMMARY: Text Cleaning Steps");
console.log("=".repeat(60));
console.log(`
Steps applied to each document:
  1. Lowercase          -> Convert all characters to lowercase
  2. Remove Punctuation -> Remove punctuation marks and symbols
  3. Remove Numbers     -> Remove digits
  4. Tokenization       -> Split text into individual words
  5. Remove Empty       -> Remove empty strings after splitting
  6. Remove Stop Words  -> Remove common words with no search value
  7. Remove Short Words -> Remove words shorter than 3 characters

Final output: cleanedDocuments object — ready for TF-IDF scoring
`);

// --- Statistics ---
console.log("Statistics:");
for (const [filename, tokens] of Object.entries(cleanedDocuments)) {
  const originalWords = documents[filename].trim().split(/\s+/).length;
  console.log(`  ${filename}: ${originalWords} original words -> ${tokens.length} tokens after cleaning`);
}
module.exports = { cleanedDocuments };
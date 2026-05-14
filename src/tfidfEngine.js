const { cleanedDocuments } = require('./preprocessing');    
// ============================================================
// STEP 3: Compute TF, IDF, and TF-IDF Scores
// ============================================================

/**
 * 1. Calculate TF (Term Frequency) for each document
 */
function computeTF(cleanedDocs) {
  const tfScores = {};

  for (const [docName, tokens] of Object.entries(cleanedDocs)) {
    tfScores[docName] = {};
    const totalTokens = tokens.length;

    // بنعد كل كلمة ظهرت كام مرة في الملف
    const wordCounts = {};
    for (const token of tokens) {
      wordCounts[token] = (wordCounts[token] || 0) + 1;
    }

    // بنحسب قيمة الـ TF لكل كلمة
    for (const [token, count] of Object.entries(wordCounts)) {
      tfScores[docName][token] = count / totalTokens;
    }
  }

  return tfScores;
}

/**
 * 2. Calculate IDF (Inverse Document Frequency) for the entire collection
 */
function computeIDF(cleanedDocs) {
  const idfScores = {};
  const totalDocs = Object.keys(cleanedDocs).length;
  const docFrequency = {};

  // بنشوف كل كلمة ظهرت في كام ملف مختلف
  for (const [docName, tokens] of Object.entries(cleanedDocs)) {
    // بنستخدم Set عشان ناخد الكلمات بدون تكرار جوه نفس الملف
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      docFrequency[token] = (docFrequency[token] || 0) + 1;
    }
  }

  // بنحسب قيمة الـ IDF لكل كلمة
  for (const [token, df] of Object.entries(docFrequency)) {
    // بنستخدم اللوغاريتم العشري 
    idfScores[token] = Math.log10(totalDocs / df);
  }

  return idfScores;
}

/**
 * 3. Combine TF and IDF to create the final score (The Output Dictionary/Matrix)
 */
function computeTFIDF(tfScores, idfScores) {
  const tfidfMatrix = {};

  for (const [docName, docTokens] of Object.entries(tfScores)) {
    tfidfMatrix[docName] = {};
    
    for (const [token, tfValue] of Object.entries(docTokens)) {
      const idfValue = idfScores[token] || 0;
      // نضرب القيمتين في بعض
      tfidfMatrix[docName][token] = tfValue * idfValue;
    }
  }

  return tfidfMatrix;
}

// ============================================================
// EXECUTION & OUTPUT
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("STEP 3: Computing TF-IDF Scores");
console.log("=".repeat(60));

// تأكد إنك بتمرر المتغير cleanedDocuments اللي طلع من الكود بتاعك
const tf = computeTF(cleanedDocuments);
const idf = computeIDF(cleanedDocuments);
const tfidfMatrix = computeTFIDF(tf, idf);

console.log("TF-IDF Computation Complete! Matrix generated.");

// عشان تشوف شكل الـ Data Structure اللي طلعت (مثال لأول ملف)
if (tfidfMatrix["doc1.txt"]) {
    console.log("\nTop 5 Important Keywords in 'doc1.txt':");
    // ترتيب الكلمات من الأعلى للأقل عشان نشوف أهم الكلمات
    const sortedTerms = Object.entries(tfidfMatrix["doc1.txt"])
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 5); 
      
    console.log(sortedTerms);
}
// التصدير عشان ملف البحث يقدر يستخدم الماتريكس وقيم الـ IDF
module.exports = { tfidfMatrix, idf };
// التصدير عشان ملف البحث يقدر يستخدم الماتريكس
module.exports = { tfidfMatrix };
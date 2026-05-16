const { cleanedDocuments } = require('./preprocessing');

function computeTF(cleanedDocs) {
  const tfScores = {};

  for (const [docName, tokens] of Object.entries(cleanedDocs)) {
    tfScores[docName] = {};
    const totalTokens = tokens.length || 1;

    const wordCounts = {};
    for (const token of tokens) {
      wordCounts[token] = (wordCounts[token] || 0) + 1;
    }

    for (const [token, count] of Object.entries(wordCounts)) {
      tfScores[docName][token] = count / totalTokens;
    }
  }

  return tfScores;
}

function computeIDF(cleanedDocs) {
  const idfScores = {};
  const totalDocs = Object.keys(cleanedDocs).length;
  const docFrequency = {};

  for (const tokens of Object.values(cleanedDocs)) {
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      docFrequency[token] = (docFrequency[token] || 0) + 1;
    }
  }

  for (const [token, df] of Object.entries(docFrequency)) {
    idfScores[token] = Math.log10(totalDocs / df);
  }

  return idfScores;
}

function computeTFIDF(tfScores, idfScores) {
  const matrix = {};

  for (const [docName, docTokens] of Object.entries(tfScores)) {
    matrix[docName] = {};

    for (const [token, tfValue] of Object.entries(docTokens)) {
      matrix[docName][token] = tfValue * (idfScores[token] || 0);
    }
  }

  return matrix;
}

const tf = computeTF(cleanedDocuments);
const idf = computeIDF(cleanedDocuments);
const tfidfMatrix = computeTFIDF(tf, idf);

module.exports = {
  computeTF,
  computeIDF,
  computeTFIDF,
  tf,
  idf,
  tfidfMatrix
};
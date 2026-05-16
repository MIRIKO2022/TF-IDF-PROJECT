const { cleanText } = require('./preprocessing');
const { cleanedDocuments } = require('./preprocessing');
const { tfidfMatrix, idf } = require('./tfidfEngine');

function processText(text) {
	return cleanText(text);
}

function calculateTF(tokens) {
	const tf = {};
	const total = tokens.length || 1;

	for (const token of tokens) {
		tf[token] = (tf[token] || 0) + 1;
	}

	for (const term of Object.keys(tf)) {
		tf[term] = tf[term] / total;
	}

	return tf;
}

function calculateIDF() {
	return idf;
}

function buildQueryVector(query, idfScores = idf) {
	const queryTokens = processText(query);
	const queryTF = calculateTF(queryTokens);
	const queryVector = {};

	for (const [term, tfValue] of Object.entries(queryTF)) {
		queryVector[term] = tfValue * (idfScores[term] || 0);
	}

	return queryVector;
}

function getVector(termScores, vocabulary) {
	return vocabulary.map((term) => termScores[term] || 0);
}

function cosineSimilarity(a, b) {
	if (a.length !== b.length || a.length === 0) {
		return 0;
	}

	let dot = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < a.length; i += 1) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}

	const denominator = Math.sqrt(normA) * Math.sqrt(normB);
	return denominator === 0 ? 0 : dot / denominator;
}

function findMostRelevantFiles(query) {
	const queryVector = buildQueryVector(query, idf);
	const vocabulary = Object.keys(queryVector);

	if (vocabulary.length === 0) {
		return [];
	}

	const queryArray = getVector(queryVector, vocabulary);
	const ranked = [];

	for (const [filename, docTermScores] of Object.entries(tfidfMatrix)) {
		const docArray = getVector(docTermScores, vocabulary);
		const score = cosineSimilarity(queryArray, docArray);

		if (score > 0) {
			ranked.push({ file: filename, similarity: score });
		}
	}

	ranked.sort((a, b) => b.similarity - a.similarity);
	return ranked;
}

module.exports = {
	processText,
	calculateTF,
	calculateIDF,
	getVector,
	cosineSimilarity,
	buildQueryVector,
	findMostRelevantFiles,
	cleanedDocuments,
	tfidfMatrix
};

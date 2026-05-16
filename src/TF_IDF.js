function calculateTF(tokens) {
    const tfMap = {};
    const totalWords = tokens.length;
    tokens.forEach(token => {
        tfMap[token] = (tfMap[token] || 0) + 1;
    });
    for (let word in tfMap) {
        tfMap[word] = tfMap[word] / totalWords;
    }
    return tfMap;
}

function calculateIDF(processedDocs) {
    const idfMap = {};
    const totalDocs = processedDocs.length;
    
    processedDocs.forEach(doc => {
        // Use a Set to only count a word once per document
        const uniqueWords = new Set(doc.tokens); 
        uniqueWords.forEach(word => {
            idfMap[word] = (idfMap[word] || 0) + 1;
        });
    });

    for (let word in idfMap) {
        // Adding +1 to avoid division by zero in edge cases
        idfMap[word] = Math.log(totalDocs / (1 + idfMap[word])); 
    }
    return idfMap;
}
function getVector(tfMap, idfMap, vocabulary) {
    return vocabulary.map(word => (tfMap[word] || 0) * (idfMap[word] || 0));
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}




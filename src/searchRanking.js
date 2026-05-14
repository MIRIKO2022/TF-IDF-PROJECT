// بنستدعي الماتريكس اللي حسبناها في الخطوة اللي فاتت
const { tfidfMatrix } = require('./tfidfEngine');

// ============================================================
// STEP 4: Search and Rank Documents
// ============================================================

/**
 * دالة بسيطة لتنظيف جملة البحث زي ما عملنا في الملفات
 */
function cleanQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\d+/g, "")
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

/**
 * دالة البحث: بتاخد كلمة البحث وترجع الملفات مترتبة
 */
function search(query) {
  const queryTokens = cleanQuery(query);
  const documentScores = {};

  // نمر على كل ملف جوه الماتريكس
  for (const [docName, docVector] of Object.entries(tfidfMatrix)) {
    let score = 0;

    // بنشوف هل كلمات البحث موجودة في الملف ده ولا لأ
    for (const token of queryTokens) {
      if (docVector[token]) {
        // لو موجودة، بنجمع الـ TF-IDF Score بتاع الكلمة دي
        score += docVector[token];
      }
    }

    // لو الملف فيه على الأقل كلمة من اللي بنبحث عنها، نحفظ السكور بتاعه
    if (score > 0) {
      documentScores[docName] = score;
    }
  }

  // ترتيب الملفات تنازلياً (من الأعلى سكور للأقل)
  const rankedResults = Object.entries(documentScores).sort((a, b) => b[1] - a[1]);
  return rankedResults;
}

// ============================================================
// EXECUTION & TESTING
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("STEP 4: Testing the Search Engine");
console.log("=".repeat(60));

// تقدر تغير الجملة دي بأي حاجة تانية عشان تختبر محرك البحث بتاعك
const userQuery = "artificial intelligence and machine learning";
console.log(`Searching for: "${userQuery}"\n`);

const results = search(userQuery);

// طباعة النتايج بشكل منظم
if (results.length > 0) {
  console.log("Top Relevant Documents:");
  results.forEach((result, index) => {
    // result[0] هو اسم الملف، result[1] هو السكور
    console.log(`  ${index + 1}. ${result[0]} (Relevance Score: ${result[1].toFixed(5)})`);
  });
} else {
  console.log("No matching documents found.");
}
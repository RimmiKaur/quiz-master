import { openDB } from "idb";

const DB_NAME = "quizDB";
const STORE_NAME = "scores";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

export const saveScore = async (score, answers) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.add({
    score,
    answers, // Store full answers array
    date: new Date().toLocaleString(),
  });
  await tx.done;
};

export const getScores = async () => {
  const db = await initDB();
  const scores = await db.getAll(STORE_NAME);

  console.log("Fetched scores from IndexedDB:", scores);

  // ✅ If IndexedDB is empty, clear sessionStorage
  if (!scores || scores.length === 0) {
    console.warn("No scores found in IndexedDB. Clearing sessionStorage...");
    sessionStorage.removeItem("scoreSaved");
    sessionStorage.removeItem("answers");
    sessionStorage.removeItem("score");
  }

  return scores;
};


export const getScoreById = async (id) => {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
};

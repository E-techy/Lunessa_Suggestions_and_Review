// utils/top_rated_reviews/topRatedDB.js
const DB_NAME = "TopRatedReviewsDB";
const STORE_NAME = "reviews";
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "reviewID" });
        store.createIndex("type", "type", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      // 🔹 Safety check: if store is missing for some reason
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        const secondRequest = indexedDB.open(DB_NAME, DB_VERSION + 1);
        secondRequest.onupgradeneeded = (event) => {
          const db2 = event.target.result;
          if (!db2.objectStoreNames.contains(STORE_NAME)) {
            const store = db2.createObjectStore(STORE_NAME, { keyPath: "reviewID" });
            store.createIndex("type", "type", { unique: false });
            store.createIndex("createdAt", "createdAt", { unique: false });
          }
        };
        secondRequest.onsuccess = () => resolve(secondRequest.result);
        secondRequest.onerror = () => reject(secondRequest.error);
      } else {
        resolve(db);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

export async function saveReviewsToDB(reviews, type) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    reviews.forEach((review) => {
      store.put({ ...review, type }); // insert/update
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getReviewsFromDB(type) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("type");
    const request = index.getAll(type);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

import { openDB } from "idb";

const DB_NAME = "setsDB";
const STORE_NAME = "sets";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        },
    });
};

export const getSetsFromDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

export const addSetToDB = async (set) => {
    const db = await initDB();
    await db.put(STORE_NAME, set);
};

export const addSetsToDB = async (sets, options = { replace: false }) => {
    if (!Array.isArray(sets) || sets.length === 0) return;

    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const set of sets) {
        const existing = await store.get(set.id);
        if (existing && !options.replace) {
            // Skip duplicate
            continue;
        }
        await store.put(set);
    }

    await tx.done;
};

export const updateSetInDB = async (id, updatedSet) => {
    const db = await initDB();
    const existingSet = await db.get(STORE_NAME, id);
    if (existingSet) {
        await db.put(STORE_NAME, { ...existingSet, ...updatedSet });
    }
};

export const deleteSetFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearSetsFromDB = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};
import { openDB } from "idb";

const DB_NAME = "backgroundsDB";
const STORE_NAME = "backgrounds";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        },
    });
};

export const getBackgroundsFromDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

export const addBackgroundToDB = async (background) => {
    const db = await initDB();
    await db.put(STORE_NAME, background);
};

export const addBackgroundsToDB = async (backgrounds, options = { replace: false }) => {
    if (!Array.isArray(backgrounds) || backgrounds.length === 0) return;

    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const background of backgrounds) {
        const existing = await store.get(background.id);
        if (existing && !options.replace) {
            // Skip duplicate
            continue;
        }
        await store.put(background);
    }

    await tx.done;
};

export const updateBackgroundInDB = async (id, updatedBackground) => {
    const db = await initDB();
    const existingBackground = await db.get(STORE_NAME, id);
    if (existingBackground) {
        await db.put(STORE_NAME, { ...existingBackground, ...updatedBackground });
    }
};

export const deleteBackgroundFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearBackgroundsFromDB = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};
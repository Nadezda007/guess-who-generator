import { openDB } from "idb";

const DB_NAME = "categoriesDB";
const STORE_NAME = "categories";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        },
    });
};

export const getCategoriesFromDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

export const addCategoryToDB = async (category) => {
    const db = await initDB();
    await db.put(STORE_NAME, category);
};

export const addCategoriesToDB = async (categories, options = { replace: false }) => {
    if (!Array.isArray(categories) || categories.length === 0) return;

    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const category of categories) {
        const existing = await store.get(category.id);
        if (existing && !options.replace) {
            // Skip duplicate
            continue;
        }
        await store.put(category);
    }

    await tx.done;
};

export const updateCategoryInDB = async (id, updatedCategory) => {
    const db = await initDB();
    const existingCategory = await db.get(STORE_NAME, id);
    if (existingCategory) {
        await db.put(STORE_NAME, { ...existingCategory, ...updatedCategory });
    }
};

export const deleteCategoryFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearCategoriesFromDB = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};
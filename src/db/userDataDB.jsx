import { openDB } from "idb";

const DB_NAME = "userDataDB";
const STORE_NAME = "userData";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "key" });
            }
        },
    });
};

export const saveUserDataToDB = async (userData) => {
    const db = await initDB();
    await db.put(STORE_NAME, { key: "settings", ...userData });
};

export const getUserDataFromDB = async () => {
    const db = await initDB();
    return await db.get(STORE_NAME, "settings");
};
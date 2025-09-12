import { openDB } from "idb";

const DB_NAME = "settingsProfilesDB";
const STORE_NAME = "settingsProfiles";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        },
    });
};

export const getAllSettingsProfilesFromDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

export const getSettingsProfileFromDB = async (id) => {
    const db = await initDB();
    return await db.get(STORE_NAME, id);
};

export const addSettingsProfileToDB = async (profile) => {
    const db = await initDB();
    await db.put(STORE_NAME, profile);
};

export const updateSettingsProfileInDB = async (id, updatedProfile) => {
    const db = await initDB();
    const existingProfile = await db.get(STORE_NAME, id);
    if (existingProfile) {
        await db.put(STORE_NAME, { ...existingProfile, ...updatedProfile });
        // console.log("updateSettingsProfileInDB");
        // console.log(updatedProfile.id);
        // console.log(existingProfile.id);
    }
};

export const deleteSettingsProfileFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

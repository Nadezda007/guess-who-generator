import { openDB } from "idb";

const DB_NAME = "cardsDB";
const STORE_NAME = "cards";

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        },
    });
};

export const getCardsFromDB = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

export const addCardToDB = async (card) => {
    const db = await initDB();
    await db.put(STORE_NAME, card);
};

export const addCardsToDB = async (cards, options = { replace: false }) => {
    if (!Array.isArray(cards) || cards.length === 0) return;

    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const card of cards) {
        const existing = await store.get(card.id);
        if (existing && !options.replace) {
            // Skip duplicate
            continue;
        }
        await store.put(card);
    }

    await tx.done;
};

export const updateCardInDB = async (id, updatedCard) => {
    const db = await initDB();
    const existingCard = await db.get(STORE_NAME, id);
    if (existingCard) {
        await db.put(STORE_NAME, { ...existingCard, ...updatedCard });
    }
};

export const deleteCardFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearCardsFromDB = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};
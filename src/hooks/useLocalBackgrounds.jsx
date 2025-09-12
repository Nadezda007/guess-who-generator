import { useState, useEffect } from "react";
import {
    getBackgroundsFromDB,
    addBackgroundToDB,
    addBackgroundsToDB,
    updateBackgroundInDB,
    deleteBackgroundFromDB,
    clearBackgroundsFromDB
} from "../db/localBackgroundsDB";

const useLocalBackgrounds = () => {
    const [localBackgrounds, setLocalBackgrounds] = useState(new Map());

    const fetchBackgrounds = async () => {
        const storedBackgrounds = await getBackgroundsFromDB();
        const backgroundsMap = new Map(storedBackgrounds.map(bg => [bg.id, bg]));
        setLocalBackgrounds(backgroundsMap);
    };

    useEffect(() => {
        fetchBackgrounds();
    }, []);

    const addLocalBackground = async (background) => {
        await addBackgroundToDB(background);
        fetchBackgrounds();
    };

    const addMultipleLocalBackgrounds = async (backgrounds, replace = false) => {
        await addBackgroundsToDB(backgrounds, { replace });
        fetchBackgrounds();
    };

    const updateLocalBackground = async (id, updatedBackground) => {
        await updateBackgroundInDB(id, updatedBackground);
        fetchBackgrounds();
    };

    const deleteLocalBackground = async (id) => {
        await deleteBackgroundFromDB(id);
        fetchBackgrounds();
    };

    const clearLocalBackgrounds = async () => {
        await clearBackgroundsFromDB();
        fetchBackgrounds();
    };

    return {
        localBackgrounds,
        addLocalBackground,
        addMultipleLocalBackgrounds,
        updateLocalBackground,
        deleteLocalBackground,
        clearLocalBackgrounds
    };
};

export default useLocalBackgrounds;

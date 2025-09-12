import { useState, useEffect } from "react";
import {
    getSetsFromDB,
    addSetToDB,
    addSetsToDB,
    updateSetInDB,
    deleteSetFromDB,
    clearSetsFromDB
} from "../db/localSetsDB";

const useLocalSets = () => {
    const [localSets, setLocalSets] = useState(new Map());

    const fetchSets = async () => {
        const storedSets = await getSetsFromDB();
        const setsMap = new Map(storedSets.map(set => [set.id, set]));
        setLocalSets(setsMap);
    };

    useEffect(() => {
        fetchSets();
    }, []);

    const addLocalSet = async (set) => {
        await addSetToDB(set);
        fetchSets();
    };

    const addMultipleLocalSets = async (sets, replace = false) => {
        await addSetsToDB(sets, { replace });
        fetchSets();
    };

    const updateLocalSet = async (id, updatedSet) => {
        await updateSetInDB(id, updatedSet);
        fetchSets();
    };

    const deleteLocalSet = async (id) => {
        await deleteSetFromDB(id);
        fetchSets();
    };

    const clearLocalSets = async () => {
        await clearSetsFromDB();
        fetchSets();
    };

    return {
        localSets,
        addLocalSet,
        addMultipleLocalSets,
        updateLocalSet,
        deleteLocalSet,
        clearLocalSets
    };
};


export default useLocalSets;
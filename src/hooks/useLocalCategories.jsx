import { useState, useEffect } from "react";
import {
    getCategoriesFromDB,
    addCategoryToDB,
    addCategoriesToDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
    clearCategoriesFromDB
} from "../db/localCategoriesDB";

const useLocalCategories = () => {
    const [localCategories, setLocalCategories] = useState(new Map());

    const fetchCategories = async () => {
        const storedCategories = await getCategoriesFromDB();
        const categoriesMap = new Map(storedCategories.map(category => [category.id, category]));
        setLocalCategories(categoriesMap);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addLocalCategory = async (category) => {
        await addCategoryToDB(category);
        fetchCategories();
    };

    const addMultipleLocalCategories = async (categories, replace = false) => {
        await addCategoriesToDB(categories, { replace });
        fetchCategories();
    };

    const updateLocalCategory = async (id, updatedCategory) => {
        await updateCategoryInDB(id, updatedCategory);
        fetchCategories();
    };

    const deleteLocalCategory = async (id) => {
        await deleteCategoryFromDB(id);
        fetchCategories();
    };

    const clearLocalCategories = async () => {
        await clearCategoriesFromDB();
        fetchCategories();
    };

    return {
        localCategories,
        addLocalCategory,
        addMultipleLocalCategories,
        updateLocalCategory,
        deleteLocalCategory,
        clearLocalCategories
    }
};


export default useLocalCategories;
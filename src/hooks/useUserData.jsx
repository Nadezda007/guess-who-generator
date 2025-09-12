import { useState, useEffect, useRef } from "react";
import { getUserDataFromDB, saveUserDataToDB } from "../db/userDataDB";
import defaultUserData from "../data/defaultUserData";

const useUserData = () => {
    const [userData, setUserData] = useState(defaultUserData);
    const [isLoading, setIsLoading] = useState(true);
    const isInitialized = useRef(false);

    useEffect(() => {
        const loadData = async () => {
            const savedData = await getUserDataFromDB();
            if (savedData) {
                const { key, ...rest } = savedData;
                setUserData(rest);
            }
            isInitialized.current = true;
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (isInitialized.current) {
            saveUserDataToDB(userData);
        }
    }, [userData]);

    return [userData, setUserData, isLoading];
};

export default useUserData;

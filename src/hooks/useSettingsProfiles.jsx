import { useState, useEffect } from "react";
import {
    getAllSettingsProfilesFromDB,
    getSettingsProfileFromDB,
    addSettingsProfileToDB,
    updateSettingsProfileInDB,
    deleteSettingsProfileFromDB,
} from "../db/settingsProfilesDB";

const useSettingsProfiles = () => {
    const [settingsProfiles, setSettingsProfiles] = useState(new Map());

    const fetchSettingsProfiles = async () => {
        const storedSettingsProfiles = await getAllSettingsProfilesFromDB();
        const profilesMap = new Map(storedSettingsProfiles.map(profile => [profile.id, profile]));
        setSettingsProfiles(profilesMap);
    };

    useEffect(() => {
        fetchSettingsProfiles();
    }, []); // settingsProfiles

    const addSettingsProfile = async (profile) => {
        await addSettingsProfileToDB(profile);
        fetchSettingsProfiles();
    };

    const updateSettingsProfile = async (id, updatedSettingsProfile) => {
        await updateSettingsProfileInDB(id, updatedSettingsProfile);
        fetchSettingsProfiles();
    };

    const deleteSettingsProfile = async (id) => {
        await deleteSettingsProfileFromDB(id);
        fetchSettingsProfiles();
    };

    return { settingsProfiles, addSettingsProfile, updateSettingsProfile, deleteSettingsProfile };
};


export default useSettingsProfiles;
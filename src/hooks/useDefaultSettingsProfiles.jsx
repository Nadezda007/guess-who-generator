import { useMemo } from "react";

import { borderSettings } from "../data/settings/borderSettings";

const useDefaultSettingsProfiles = () => {
    const defaultProfiles = useMemo(() => {
        const allProfiles = [
            borderSettings,
        ];
        return new Map(allProfiles.map(profile => [profile.id, profile]));
    }, []);

    return { defaultSettingsProfiles: defaultProfiles };
};

export default useDefaultSettingsProfiles;
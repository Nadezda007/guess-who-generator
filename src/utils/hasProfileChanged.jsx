import findMismatches from "./findMismatches";

export const hasProfileChanged = (userData, profile) => {
    const mismatches = findMismatches(userData, profile);
    return mismatches.length > 0;
};
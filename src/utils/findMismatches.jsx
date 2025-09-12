import arraysEqual from "./arraysEqual";

const findMismatches = (userData, profile) => {
    const excludeKeys = ["id", "order", "isNone", "editable", "name"];
    const mismatches = [];

    for (const [key, value] of Object.entries(profile)) {
        if (excludeKeys.includes(key)) continue;

        const userValue = userData?.[key];

        const isEqual = Array.isArray(value) && Array.isArray(userValue)
            ? arraysEqual(value, userValue)
            : userValue === value;

        if (!isEqual) {
            mismatches.push({
                key,
                profileValue: value,
                userValue: userValue,
            });
        }
    }

    return mismatches;
};

export default findMismatches;

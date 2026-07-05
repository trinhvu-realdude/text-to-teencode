import { TENEECODE_MAPPING } from "./constant";

export const convertToTeencode = (text: string, customMapping?: Map<string, string>): string => {
    return text
        .split("")
        .map((char) => {
            const key = char.toLowerCase();
            const defaultVal = TENEECODE_MAPPING.get(key);
            
            if (defaultVal === undefined) {
                return char;
            }

            if (customMapping) {
                const customVal = customMapping.get(key);
                if (customVal !== undefined && customVal.trim() !== '') {
                    return customVal;
                }
            }
            
            return defaultVal;
        })
        .join("");
};

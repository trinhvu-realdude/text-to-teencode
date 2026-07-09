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

export const convertFromTeencode = (text: string, customMapping?: Map<string, string>): string => {
    const reverseMap = new Map<string, string>();
    
    // Default mapping
    TENEECODE_MAPPING.forEach((value, key) => {
        reverseMap.set(value, key);
    });

    // Override with custom mapping
    if (customMapping) {
        customMapping.forEach((value, key) => {
            if (value.trim() !== "") {
                const defaultVal = TENEECODE_MAPPING.get(key);
                if (defaultVal && reverseMap.get(defaultVal) === key) {
                    reverseMap.delete(defaultVal);
                }
                reverseMap.set(value, key);
            }
        });
    }

    // Sort teencodes by length descending to match longest first
    const sortedTeencodes = Array.from(reverseMap.keys()).sort((a, b) => b.length - a.length);

    let decodedText = "";
    let i = 0;
    while (i < text.length) {
        let matched = false;
        for (const teencode of sortedTeencodes) {
            if (text.substring(i, i + teencode.length).toLowerCase() === teencode.toLowerCase()) {
                decodedText += reverseMap.get(teencode);
                i += teencode.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            decodedText += text[i];
            i++;
        }
    }
    return decodedText;
};

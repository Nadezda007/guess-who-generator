import JSZip from "jszip";

const DEFAULT_MIME_TYPE = "application/octet-stream";
const OCTET_STREAM_PREFIX_REGEX = /^data:application\/octet-stream[^,]*/;

function getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'webp': return 'image/webp';
        default: return DEFAULT_MIME_TYPE;
    }
}

async function blobToDataURL(blob, mimeType) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (!blob.type && mimeType !== DEFAULT_MIME_TYPE) {
                resolve(result.replace(OCTET_STREAM_PREFIX_REGEX, `data:${mimeType};base64`));
            } else {
                resolve(result);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function processSection({
    zip,                       // archive
    jsonPath,                  // path to the JSON file
    imageFolder,               // path to the images folder
    itemKey,                   // array key in JSON (cards, categories, etc.)
    requiredFields,            // required fields
    typeName,                  // section name (for errors)
    imageRequired = false,     // whether the image is required
    imageField = "imagePath",  // name of the image field
    errors                     // array of errors
}) {
    const jsonFile = zip.file(jsonPath);
    if (!jsonFile) return null;

    // Check the image folder only if images are required
    const hasImages = Object.keys(zip.files).some((f) => f.startsWith(imageFolder));
    if (imageRequired && !hasImages) {
        errors.push(`Image folder missing: ${imageFolder}`);
        return null;
    }

    let jsonData;
    try {
        const jsonStr = await jsonFile.async("string");
        jsonData = JSON.parse(jsonStr);
    } catch (e) {
        errors.push(`Failed to read ${jsonPath}: ${e.message}`);
        return null;
    }

    const items = jsonData[itemKey];
    if (!Array.isArray(items)) {
        errors.push(`${jsonPath} must contain an array '${itemKey}'`);
        return null;
    }

    const validItems = [];

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const lineInfo = `${typeName} #${index + 1}`;

        // Check required fields
        for (const field of requiredFields) {
            if (!item[field]) {
                errors.push(`${lineInfo}: missing field '${field}'`);
                continue;
            }
        }

        const imageName = item[imageField] || item.image; // support imagePath/imagePath
        if (imageRequired && !imageName) {
            errors.push(`${lineInfo} (id: ${item.id || "?"}): missing field ${imageField}`);
            continue;
        }

        // Check if image exists, if specified
        let fullImagePath = null;
        if (imageName) {
            fullImagePath = `${imageFolder}${imageName}`;
            if (!zip.file(fullImagePath)) {
                errors.push(`${lineInfo} (id: ${item.id || "?"}): image not found ${imageName}`);
                continue;
            }
        }

        validItems.push({
            ...item,
            imagePath: fullImagePath || null
        });
    }

    // Convert images to DataURL only if they exist
    for (const obj of validItems) {
        if (!obj.imagePath) continue;

        try {
            const imgFile = zip.file(obj.imagePath);
            if (imgFile) {
                const filename = obj.imagePath.split("/").pop();
                const mimeType = getMimeType(filename);
                const blob = await imgFile.async("blob");
                obj.image = await blobToDataURL(blob, mimeType);
            }
        } catch (e) {
            errors.push(`(id: ${obj.id || "?"}): failed to process image ${obj.imagePath} - ${e.message}`);
        }
    }

    return validItems;
}

export async function preparePackFile(file, setError) {
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    const errors = [];
    setError(null);

    if (!file) {
        const result = { cards: null, categories: null, sets: null, backgrounds: null };
        setError("No file selected.");
        return result;
    }
    if (file.size > MAX_FILE_SIZE) {
        const result = { cards: null, categories: null, sets: null, backgrounds: null };
        setError("Archive size exceeds 100 MB.");
        return result;
    }

    let zip;
    try {
        zip = await JSZip.loadAsync(file);
    } catch (e) {
        const msg = `Failed to read archive: ${e.message}`;
        const result = { cards: null, categories: null, sets: null, backgrounds: null };
        setError(msg);
        return result;
    }

    const cards = await processSection({
        zip,
        jsonPath: "cards/cardConfig.json",
        imageFolder: "cards/images/",
        itemKey: "cards",
        requiredFields: ["id"],
        typeName: "Card",
        imageRequired: true,
        imageField: "imagePath",
        errors
    });

    const categories = await processSection({
        zip,
        jsonPath: "categories/categoryList.json",
        imageFolder: "categories/images/",
        itemKey: "categories",
        requiredFields: ["id"],
        typeName: "Category",
        imageRequired: false,
        imageField: "imagePath",
        errors
    });

    const sets = await processSection({
        zip,
        jsonPath: "sets/setConfig.json",
        imageFolder: "sets/images/",
        itemKey: "sets",
        requiredFields: ["id"],
        typeName: "Set",
        imageRequired: false,
        imageField: "imagePath",
        errors
    });

    const backgrounds = await processSection({
        zip,
        jsonPath: "backgrounds/backgroundConfig.json",
        imageFolder: "backgrounds/images/",
        itemKey: "backgrounds",
        requiredFields: ["id"],
        typeName: "Background",
        imageRequired: true,
        imageField: "imagePath",
        errors
    });

    if (errors.length > 0) {
        const errText = errors.join("\n");
        const result = { cards: null, categories: null, sets: null, backgrounds: null };
        setError(errText);
        return result;
    }

    // If everything is fine — clear the error and return sections
    setError(null);
    return {
        cards: cards ?? null,
        categories: categories ?? null,
        sets: sets ?? null,
        backgrounds: backgrounds ?? null
    };
}

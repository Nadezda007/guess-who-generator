// utils/downloadPackFromMaps.js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/** Helpers **/

function isMapLike(x) {
    return x instanceof Map;
}
function isArrayLike(x) {
    return Array.isArray(x);
}
function iterateEntries(mapLike) {
    // Returns an array [ [id, item], ... ]
    const out = [];
    if (!mapLike) return out;
    if (isMapLike(mapLike)) {
        for (const [k, v] of mapLike.entries()) out.push([k, v]);
        return out;
    }
    if (isArrayLike(mapLike)) {
        for (const item of mapLike) {
            const id = item && (item.id ?? item.key);
            out.push([id, item]);
        }
        return out;
    }
    if (typeof mapLike === "object") {
        for (const k of Object.keys(mapLike)) out.push([k, mapLike[k]]);
        return out;
    }
    return out;
}

function dataURLtoBlob(dataURL) {
    // data:[<mediatype>][;base64],<data>
    const parts = dataURL.split(",");
    if (parts.length !== 2) throw new Error("Invalid DataURL");
    const meta = parts[0];
    const b64 = parts[1];
    const mimeMatch = meta.match(/data:([^;]+);base64/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const binary = atob(b64);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
    return new Blob([u8], { type: mime });
}

function mimeToExt(mime) {
    if (!mime) return "png";
    const m = mime.split("/")[1] || mime;
    if (m === "jpeg") return "jpg";
    return m.replace(/[^a-z0-9]/gi, "");
}
function extFromDataURL(dataURL) {
    const meta = dataURL.split(",")[0];
    const m = meta.match(/data:([^;]+);base64/);
    if (!m) return "png";
    return mimeToExt(m[1]);
}

function computeRelativeName(containerFolder, existingPath, id, dataURL) {
    // containerFolder, e.g. "cards/images/"
    if (existingPath) {
        // if the path contains containerFolder - return the part after it
        const idx = existingPath.indexOf(containerFolder);
        if (idx !== -1) return existingPath.slice(idx + containerFolder.length);
        // otherwise return only the file name (the last segment)
        return existingPath.split("/").pop();
    }
    const ext = dataURL ? extFromDataURL(dataURL) : "png";
    return `${id}.${ext}`;
}

// Main function
export async function downloadPack({
    cards,
    categories,
    sets,
    backgrounds,
    packName = "pack.zip"
}) {
    const zip = new JSZip();

    // --- CARDS ---
    const cardsEntries = iterateEntries(cards);
    if (cardsEntries.length > 0) {
        const cardsArr = [];
        for (const [key, rawCard] of cardsEntries) {
            const card = { ...(rawCard || {}) }; // shallow copy
            const id = card.id ?? key ?? Math.random().toString(36).slice(2, 8);
            // image data could be in card.image (dataURL) or card.imageData etc
            const dataUrl = card.image || card.imageData || card.imageBase64 || null;
            // existing path if any
            const existing = card.imagePath || card.image || null;

            const relName = computeRelativeName("cards/images/", card.imagePath || null, id, dataUrl);
            // build JSON object (we keep imagePath as importer expects)
            const cardForJson = { ...card };
            // remove big data field from JSON
            delete cardForJson.image;
            delete cardForJson.imageData;
            delete cardForJson.imageBase64;
            cardForJson.imagePath = relName;

            cardsArr.push(cardForJson);

            // if there is a dataURL, add the file to the ZIP
            if (dataUrl) {
                try {
                    const blob = dataURLtoBlob(dataUrl);
                    zip.file(`cards/images/${relName}`, blob);
                } catch (e) {
                    console.warn(`Unable to convert card image ${id}:`, e);
                }
            }
        }
        // save config
        zip.file("cards/cardConfig.json", JSON.stringify({ cards: cardsArr }, null, 2));
    }

    // --- CATEGORIES ---
    const catsEntries = iterateEntries(categories);
    if (catsEntries.length > 0) {
        const catsArr = [];
        for (const [key, rawCat] of catsEntries) {
            const cat = { ...(rawCat || {}) };
            const id = cat.id ?? key ?? Math.random().toString(36).slice(2, 8);
            const dataUrl = cat.image || cat.imageData || cat.imageBase64 || cat.image || null;
            const relName = computeRelativeName("categories/images/", cat.imagePath || null, id, dataUrl);

            const catForJson = { ...cat };
            delete catForJson.image;
            delete catForJson.imageData;
            delete catForJson.imageBase64;
            // image is optional — if available, write imagePath
            if (dataUrl || cat.imagePath) catForJson.imagePath = relName;

            catsArr.push(catForJson);

            if (dataUrl) {
                try {
                    const blob = dataURLtoBlob(dataUrl);
                    zip.file(`categories/images/${relName}`, blob);
                } catch (e) {
                    console.warn(`Unable to convert category image ${id}:`, e);
                }
            }
        }
        zip.file("categories/categoryList.json", JSON.stringify({ categories: catsArr }, null, 2));
    }

    // --- SETS ---
    const setsEntries = iterateEntries(sets);
    if (setsEntries.length > 0) {
        const setsArr = [];
        for (const [key, rawSet] of setsEntries) {
            const set = { ...(rawSet || {}) };
            const id = set.id ?? key ?? Math.random().toString(36).slice(2, 8);
            const dataUrl = set.image || set.imageData || set.imageBase64 || null;
            const relName = computeRelativeName("sets/images/", set.imagePath || null, id, dataUrl);

            const setForJson = { ...set };
            delete setForJson.image;
            delete setForJson.imageData;
            delete setForJson.imageBase64;
            if (dataUrl || set.imagePath) setForJson.imagePath = relName;

            setsArr.push(setForJson);

            if (dataUrl) {
                try {
                    const blob = dataURLtoBlob(dataUrl);
                    zip.file(`sets/images/${relName}`, blob);
                } catch (e) {
                    console.warn(`Unable to convert set image ${id}:`, e);
                }
            }
        }
        zip.file("sets/setConfig.json", JSON.stringify({ sets: setsArr }, null, 2));
    }

    // --- BACKGROUNDS ---
    const bgsEntries = iterateEntries(backgrounds);
    if (bgsEntries.length > 0) {
        const bgsArr = [];
        for (const [key, rawBg] of bgsEntries) {
            const bg = { ...(rawBg || {}) };
            const id = bg.id ?? key ?? Math.random().toString(36).slice(2, 8);
            const dataUrl = bg.image || bg.imageData || bg.imageBase64 || null;
            const relName = computeRelativeName("backgrounds/images/", bg.imagePath || null, id, dataUrl);

            const bgForJson = { ...bg };
            delete bgForJson.image;
            delete bgForJson.imageData;
            delete bgForJson.imageBase64;
            // background requires image? your importer required image for backgrounds — but we allow optional
            if (dataUrl || bg.imagePath) bgForJson.imagePath = relName;

            bgsArr.push(bgForJson);

            if (dataUrl) {
                try {
                    const blob = dataURLtoBlob(dataUrl);
                    zip.file(`backgrounds/images/${relName}`, blob);
                } catch (e) {
                    console.warn(`Failed to convert background ${id}:`, e);
                }
            }
        }
        zip.file("backgrounds/backgroundConfig.json", JSON.stringify({ backgrounds: bgsArr }, null, 2));
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: "blob" });
    try {
        saveAs(content, packName);
    } catch (e) {
        // fallback
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = packName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}

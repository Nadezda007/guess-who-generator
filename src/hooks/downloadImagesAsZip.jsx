import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";

const downloadImagesAsZip = async ({
    scale = 4,
    imageFormat = "png",
}) => {

    const elements = document.querySelectorAll(".paper");
    const isPng = imageFormat.toLowerCase() === "png";
    const imgName = "cards_sheet";

    if (!elements.length) {
        console.error("No .paper elements found!");
        return;
    }

    const zip = new JSZip();
    const zipFileName = "cards_sheets.zip";

    const promises = Array.from(elements).map(async (element, index) => {
        try {
            if (isPng) {
                const dataUrl = await htmlToImage.toPng(element, {
                    quality: 1, // Highest quality
                    pixelRatio: scale, // Increases resolution
                });

                // Add image to the archive
                zip.file(`${imgName}_${index + 1}.png`, dataUrl.split(',')[1], { base64: true });
            } else {
                const dataUrl = await htmlToImage.toJpeg(element, {
                    quality: 1, // Highest quality
                    pixelRatio: scale, // Increases resolution
                    backgroundColor: "#FFFFFFFF",
                });

                // Add image to the archive
                zip.file(`${imgName}_${index + 1}.jpeg`, dataUrl.split(',')[1], { base64: true });
            }
        } catch (error) {
            console.error(`Element rendering error ${index + 1}:`, error);
        }
    });

    // Generate ZIP and download
    await Promise.all(promises);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, zipFileName);
};

export default downloadImagesAsZip;

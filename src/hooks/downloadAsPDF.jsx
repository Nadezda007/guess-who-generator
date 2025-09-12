import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

const downloadAsPDF = async ({
    scale = 4,
    imageFormat = "png",
    imgWidth = 210, imgHeight = 297,
    paperOrientation = "portrait", paperFormat = "a4"
}) => {

    const elements = document.querySelectorAll(".paper");
    const isPng = imageFormat.toLowerCase() === "png";
    const isPortrait = paperOrientation === "portrait";
    const w = isPortrait ? imgWidth : imgHeight;
    const h = isPortrait ? imgHeight : imgWidth;


    if (!elements.length) {
        console.error("No .paper elements found!");
        return;
    }

    const pdf = new jsPDF({ orientation: isPortrait ? "p" : "l", unit: "mm", format: paperFormat });
    const pdfFileName = "cards_sheets.pdf";

    for (let i = 0; i < elements.length; i++) {
        try {
            const element = elements[i];
            if (isPng) {
                const dataUrl = await htmlToImage.toPng(element, {
                    quality: 1, // Highest quality
                    pixelRatio: scale, // Increases resolution
                });

                // Add image to the page
                if (i !== 0) pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
            } else {
                const dataUrl = await htmlToImage.toJpeg(element, {
                    quality: 1, // Highest quality
                    pixelRatio: scale, // Increases resolution
                    backgroundColor: "#FFFFFFFF",
                });

                // Add image to the page
                if (i !== 0) pdf.addPage();
                pdf.addImage(dataUrl, "JPEG", 0, 0, w, h);
            }
        } catch (error) {
            console.error(`Element rendering error ${i + 1}:`, error);
        }

    };

    // Generate PDF and download
    pdf.save(pdfFileName);
};

export default downloadAsPDF;

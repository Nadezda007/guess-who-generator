import React, { useState } from "react";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AddLocalCardDialog from "./dialogs/AddLocalCardDialog";

import { Box } from "@mui/material";
import { useTranslation } from 'react-i18next';


const DragAndDropOverlay = ({ addLocalCard, children, sx = {} }) => {
    const { t } = useTranslation(); // connect i18next

    const [dragging, setDragging] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [dragCounter, setDragCounter] = useState(0); // important
    const [openDialog, setOpenDialog] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragCounter((prev) => prev + 1);
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragCounter((prev) => {
            const newCount = prev - 1;
            if (newCount <= 0) {
                setDragging(false);
                return 0;
            }
            return newCount;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpload = async (newCard, imageFile) => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = async () => {
                newCard.image = reader.result;
                await addLocalCard(newCard);
            };
            reader.readAsDataURL(imageFile);
        } else {
            await addLocalCard(newCard);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        setDragCounter(0);

        const allFiles = [...e.dataTransfer.files];
        const imageFiles = allFiles.filter((file) => file.type.startsWith("image/"));
        const invalidFiles = allFiles.filter((file) => !file.type.startsWith("image/"));

        if (invalidFiles.length > 0) {
            setErrorMessage(t('error_not_images'));
            setTimeout(() => setErrorMessage(""), 3000); // Error clearing in 3 seconds
        }

        if (imageFiles.length > 0) {
            if (imageFiles.length > 1) {
                for (const file of imageFiles) {
                    const fileName = file.name.replace(/\.[^/.]+$/, "");
                    handleUpload({ name: fileName, imageURL: "" }, file);
                }
            } else {
                const file = imageFiles[0];
                setCurrentFile(file);  // Save the file for further work
                setOpenDialog(true);  // Opening a dialogue
            }
        }
    };

    return (
        <Box
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{ position: "relative", width: "100%", height: "100%", ...sx }}
        >
            {children}

            {/* Overlay for dragging and dropping */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold",
                    zIndex: 10,
                    pointerEvents: dragging ? "auto" : "none", // // Block interaction with elements under the overlay
                    opacity: dragging ? 1 : 0, // Fade in/out
                    transition: "opacity 0.2s ease-in-out", // Smooth transition for opacity
                }}
            >
                <div style={{
                    textAlign: "center",
                    padding: "50px 40px",
                    borderRadius: "16px",
                    border: "4px dashed",
                    borderColor: "divider",
                }}>
                    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 60, mb: 1 }} />
                    <div>{t('drag_drop_hint')}</div>
                </div>
            </div>

            {errorMessage && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(255, 0, 0, 0.8)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        zIndex: 11,
                    }}
                >
                    {errorMessage}
                </div>
            )}

            {/* Dialog box for entering the card name, if one is loaded */}
            {openDialog && (
                <AddLocalCardDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onUpload={handleUpload}
                    file={currentFile}
                />
            )}
        </Box>
    );
};

export default DragAndDropOverlay;

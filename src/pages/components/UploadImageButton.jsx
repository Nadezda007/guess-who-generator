import React, { useState } from "react";
import { ButtonBase, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import UploadImageDialog from "../dialogs/UploadImageDialog";

const UploadImageButton = ({
    label = "Upload Image",
    onUpload,
    width,
    fontSizeScale = 1
}) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);

    const handleUpload = async (data, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                data.image = reader.result;
                await onUpload(data);
            };
            reader.readAsDataURL(file);
        } else {
            await onUpload(data);
        }
    };

    return (
        <>
            <ButtonBase
                onClick={handleOpen}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: width ?? "100%",
                    aspectRatio: 3 / 4,
                    borderRadius: "4px",
                    border: "2px dashed",
                    borderColor: "divider",
                    boxShadow: "none",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "background-color 0.15s, transform 0.1s",
                    "&:hover": { backgroundColor: "action.hover" },
                }}
            >
                <AddPhotoAlternateOutlinedIcon
                    sx={{
                        fontSize: fontSizeScale * 36,
                        mb: "2px"
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{
                        paddingX: "4px",
                        fontSize: `${fontSizeScale * 11}px`,
                        textAlign: "center",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                    }}
                >
                    {label}
                </Typography>
            </ButtonBase>

            <UploadImageDialog
                label={label}
                open={openDialog}
                onClose={handleClose}
                onUpload={handleUpload}
            />
        </>
    );
};

export default UploadImageButton;

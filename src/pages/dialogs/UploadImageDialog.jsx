import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Typography,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';


const UploadImageDialog = ({
    label = "Upload Image",
    open, onClose,
    onUpload
}) => {

    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState(null);

    const isUploadDisabled = !file && !imageUrl.trim();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (isUploadDisabled) return;
        onUpload({ name: name, imageURL: imageUrl }, file);
        setFile(null);
        setImageUrl("");
        setName("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            scroll="body"
            sx={{
                ".MuiDialog-paper": {
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "20px",
                },
            }}
        >
            <DialogTitle sx={{ paddingBottom: "8px" }}>
                {label}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label={t('form_field_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                    slotProps={{
                        input: {
                            endAdornment: name && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setName("")}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <TextField
                    label={t('form_field_image_url')}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                    slotProps={{
                        input: {
                            endAdornment: imageUrl && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setImageUrl("")}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <Box sx={{ mt: 2 }}>
                    <input
                        type="file"
                        accept="image/*"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant={file ? "contained" : "outlined"}
                            component="span"
                            fullWidth
                            startIcon={file ? <LoopOutlinedIcon /> : <UploadOutlinedIcon />}>
                            {file ? t('button_replace_file') : t('button_choose_file')}
                        </Button>
                    </label>

                    {file && <Typography variant="body2" color="primary" sx={{ mt: "2px" }}>
                        {file.name}
                    </Typography>}
                </Box>
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_cancel')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleUpload}
                    disabled={isUploadDisabled}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_upload')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadImageDialog;

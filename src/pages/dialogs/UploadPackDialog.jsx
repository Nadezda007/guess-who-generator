import React, { useState } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

    Typography,
    Button,

    Backdrop,
    CircularProgress
} from "@mui/material";


import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";

const UploadPackDialog = ({ open, onClose, onSubmit }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setError(null);
            setFile(selectedFile);
        }
    };

    return (
        <>
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
                <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between", gap: 1 }}>
                    <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                        {t('uploading_pack')}
                    </Typography>

                    <Button
                        component="a"
                        variant="outlined"
                        color="warning"
                        sx={{ alignSelf: "center" }}
                        href={import.meta.env.BASE_URL + "template.zip"}
                        download>
                        {t('download_template')}
                    </Button>
                </DialogTitle>

                <DialogContent>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-line", mb: 1, }}>
                        {t("upload_pack_description")}
                    </Typography>

                    <Box>
                        <input
                            type="file"
                            accept="image/zip"
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

                        {error && (
                            <Typography variant="body2" color="error" sx={{ whiteSpace: "pre-line", mt: "2px" }}>
                                {error}
                            </Typography>
                        )}
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
                        disabled={!file}
                        onClick={async () => {
                            setLoading(true);
                            await onSubmit(file, setError);
                            setLoading(false);
                        }}
                        sx={{ padding: "6px 14px 4px 14px" }} >
                        {t('button_continue')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* LOADING */}
            <Backdrop
                open={loading}
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1, // above Dialog
                    color: "#fff",
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default UploadPackDialog;
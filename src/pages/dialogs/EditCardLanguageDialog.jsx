import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ClearIcon from "@mui/icons-material/Clear";

const EditCardLanguageDialog = ({ open, onClose, userData, setUserData }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [newLanguage, setNewLanguage] = useState("");

    // Load custom language
    useEffect(() => {
        if (open) setNewLanguage(userData.customCardLanguage);
    }, [open, userData.customCardLanguage]);

    useEffect(() => {
        if (!open) setNewLanguage("");
    }, [open]);

    // Language change handler
    const handleLanguageChange = (event) => {
        setNewLanguage(event.target.value);
    };

    // Save handler
    const handleSave = () => {
        setUserData((prev) => ({ ...prev, customCardLanguage: newLanguage }));
        onClose();
    };

    const handleReset = () => {
        setUserData((prev) => ({ ...prev, customCardLanguage: "" }));
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
            <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between", gap: 1 }}   >
                <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                    {t('cards_language')}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReset}
                    sx={{ alignSelf: "center" }}>
                    {t('button_reset')}
                </Button>
            </DialogTitle>

            <DialogContent>
                <TextField
                    label={t('language_code')}
                    value={newLanguage}
                    onChange={handleLanguageChange}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    slotProps={{
                        input: {
                            endAdornment: newLanguage && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setNewLanguage("")}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        fontStyle: 'italic',
                    }}>
                    {t('language_code_hint')}
                </Typography>
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
                    onClick={handleSave}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCardLanguageDialog;

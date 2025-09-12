import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    InputAdornment,
    IconButton
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ClearIcon from "@mui/icons-material/Clear";

const EditProfileDialog = ({ open, onClose, profile, onSave }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (open && profile) {
            setNewName(profile.name || "");
        }
    }, [open, profile]);

    useEffect(() => {
        if (!open) {
            setNewName("");
        }
    }, [open]);

    // Name change handler
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    // Save handler
    const handleSave = () => {
        if (profile) {
            onSave(profile.id, newName.trim());
        }
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
                {t('profile_editing')} "{profile.name || ""}"
            </DialogTitle>

            <DialogContent>
                <TextField
                    label={t('form_field_name')}
                    value={newName}
                    onChange={handleNameChange}
                    fullWidth
                    disabled={!profile}
                    variant="outlined"
                    sx={{ mt: 1 }}
                    slotProps={{
                        input: {
                            endAdornment: newName && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setNewName("")}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
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
                    disabled={!newName.trim()}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ClearIcon from "@mui/icons-material/Clear";

import { v4 as uuidv4 } from 'uuid';

const AddSettingsProfileDialog = ({ open, onClose, settings, profileList, addSettingsProfile, selectProfile }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [name, setName] = useState("");
    const [templateId, setTemplateId] = useState("none");

    useEffect(() => {
        if (!open) {
            setName("");
        }
    }, [open]);

    const addProfile = async (name, templateId, profileList) => {
        const template = templateId === "none"
            ? settings
            : profileList.find(p => p.id === templateId);

        const newProfile = {
            ...template,
            id: uuidv4(),
            name,
            order: profileList.length > 0
                ? Math.max(...profileList.map(p => p.order ?? 0)) + 1
                : 0,
        };

        await addSettingsProfile(newProfile);
        await selectProfile(newProfile.id);
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

            <DialogTitle display="flex" sx={{ paddingBottom: "8px" }}>
                {t('new_settings_profile')}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label={t('profile_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    variant="outlined"
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

                <FormControl fullWidth sx={{ mt: "12px" }}>
                    <InputLabel>{t('profile_template')}</InputLabel>
                    <Select
                        label={t('profile_template')}
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                    >
                        {Array.from(profileList.values()).map((profile) => (
                            <MenuItem
                                key={profile.id}
                                value={profile.id}
                            // sx={{ textDecoration: profile.editable ? "underline" : "none" }}
                            >
                                {profile.name || profile.id}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>

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
                    onClick={() => {
                        addProfile(name, templateId, profileList);
                        onClose();
                    }}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSettingsProfileDialog;

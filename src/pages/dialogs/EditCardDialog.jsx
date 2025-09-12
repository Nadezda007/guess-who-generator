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
import { getJsonTranslation } from "../../i18n/getJsonTranslation";
import { Box } from "@mui/system";

const EditCardDialog = ({ open, onClose, card, editedCards, setEditedCards, userData }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [newName, setNewName] = useState("");
    const [customImage, setCustomImage] = useState("");

    // Load custom data (name and image)
    useEffect(() => {
        if (open) {
            const customData = editedCards?.[card.id] || {};
            setNewName(customData.name || getJsonTranslation(card.name, userData));
            setCustomImage(customData.imageURL || "");
        }
    }, [open, card.id, editedCards]);

    useEffect(() => {
        if (!open) {
            setNewName("");
            setCustomImage("");
        }
    }, [open]);

    // Name change handler
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    // Image URL change handler
    const handleImageChange = (event) => {
        setCustomImage(event.target.value);
    };

    // Save handler
    const handleSave = () => {
        setEditedCards((prev) => {
            const updated = { ...prev };

            // Delete custom data if it has not been changed
            if (newName === getJsonTranslation(card.name, userData) && !customImage) {
                delete updated[card.id];
            } else {
                updated[card.id] = {
                    name: newName !== getJsonTranslation(card.name, userData) ? newName : undefined,
                    imageURL: customImage || undefined,
                };
            }

            return updated;
        });

        onClose();
    };

    const handleReset = () => {
        setEditedCards((prev) => {
            const updated = { ...prev };
            delete updated[card.id]; // Completely remove custom card settings
            return updated;
        });
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
            <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between", gap: 1 }} >
                <Box>
                    <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                        {t('card')} "{card.id}"
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            fontStyle: 'italic',
                        }}>
                        {t('not_saved_on_reload')}
                    </Typography>
                </Box>

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
                    label={t('form_field_card_name')}
                    value={newName}
                    onChange={handleNameChange}
                    fullWidth
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

                <TextField
                    label={t('form_field_image_url')}
                    value={customImage}
                    onChange={handleImageChange}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    slotProps={{
                        input: {
                            endAdornment: customImage && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setCustomImage("")}>
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
                        mt: 0.5,
                    }}>
                    {`${t('available_languages')} ${Object.keys(card.name).join(", ")}`}
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

export default EditCardDialog;

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

const EditLocalCardDialog = ({ open, onClose, card, updateLocalCard, deleteLocalCard, userData }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [newName, setNewName] = useState("");
    const [customImage, setCustomImage] = useState("");

    useEffect(() => {
        if (open && card) {
            setNewName(getJsonTranslation(card.name, userData) || "");
            setCustomImage(card.imageURL || "");
        }
    }, [open, card]);

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
    const handleSave = async () => {
        // Take the current card names (if any) or create an empty object
        const currentNames = card.name && typeof card.name === "object" ? card.name : {};

        // Define the language to save (e.g., interface language or selected card language)
        const lang = userData?.customCardLanguage || i18n.language;

        //Create a new object with an updated name for a specific language
        const updatedNames = {
            ...currentNames,
            [lang]: newName
        };
        await updateLocalCard(card.id, { name: updatedNames, imageURL: customImage });
        onClose();
    };

    // Card removal handler
    const handleDelete = async () => {
        await deleteLocalCard(card.id);
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
            <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between", gap: 1 }}>
                <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                    {t('card_editing')}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    sx={{ alignSelf: "center" }}
                    onClick={handleDelete}>
                    {t('delete')}
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

export default EditLocalCardDialog;

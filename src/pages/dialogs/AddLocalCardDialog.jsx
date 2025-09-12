import React, { useState } from "react";
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

const AddLocalCardDialog = ({ open, onClose, onUpload, file }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [cardName, setCardName] = useState("");

    // Name change handler
    const handleNameChange = (event) => {
        setCardName(event.target.value);
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
                {t('add_card_button')}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label={t('form_field_card_name')}
                    value={cardName}
                    onChange={handleNameChange}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    slotProps={{
                        input: {
                            endAdornment: cardName && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" size="small" onClick={() => setCardName("")}>
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
                    onClick={() => {
                        onUpload({ name: cardName, imageURL: "" }, file);
                        onClose();
                    }}
                    sx={{ padding: "6px 14px 4px 14px" }} >
                    {t('button_create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddLocalCardDialog;

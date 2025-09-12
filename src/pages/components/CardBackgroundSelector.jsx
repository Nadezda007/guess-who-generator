import React, { useState, useRef } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import CardBackgroundDialog from "../dialogs/CardBackgroundDialog";
import { useTranslation } from 'react-i18next';
import { getJsonTranslation } from "../../i18n/getJsonTranslation";

const CardBackgroundSelector = ({
    label = "Cards background",
    dialogLabel = "Select background",
    backgrounds, localBackgrounds,
    addLocalBackground, deleteLocalBackground,
    name,
    value,
    onChange,
    userData,
    sx = {}
}) => {
    const { t } = useTranslation(); // connect i18next
    const [dialogOpen, setDialogOpen] = useState(false);
    const originalValueRef = useRef(value);

    const handleOpen = () => {
        originalValueRef.current = value;
        onChange({ target: { name, value } });
        setDialogOpen(true);
    };

    const handleClose = () => {
        onChange({ target: { name, value: originalValueRef.current } });
        setDialogOpen(false);
    };

    const handleSave = () => {
        setDialogOpen(false);
    };

    const handleReset = () => {
        onChange({ target: { name, value: null } });
        setDialogOpen(false);
    };

    return (
        <>
            <FormControl fullWidth sx={{ mt: 2, ...sx }}>
                <InputLabel>{label}</InputLabel>
                <Select
                    name={name}
                    value={value ?? "none"}
                    label={label}
                    onClick={handleOpen}
                    readOnly
                >
                    <MenuItem value="none">{t('not_set')}</MenuItem>

                    {Array.from(localBackgrounds.values()).map((bg) => (
                        <MenuItem key={bg.id} value={bg.id}>
                            {getJsonTranslation(bg.name, userData) || `Custom ${bg.id}`}
                        </MenuItem>
                    ))}
                    {Array.from(backgrounds.values()).map((bg) => (
                        <MenuItem key={bg.id} value={bg.id}>
                            {getJsonTranslation(bg.name, userData) || bg.id}
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>

            <CardBackgroundDialog
                label={dialogLabel}
                open={dialogOpen}
                onClose={handleClose}
                backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                addLocalBackground={addLocalBackground} deleteLocalBackground={deleteLocalBackground}
                name={name}
                value={value}
                onChange={onChange}
                onReset={handleReset}
                onSave={handleSave}
                userData={userData}
            />
        </>
    );
};

export default CardBackgroundSelector;

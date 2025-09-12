
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
} from "@mui/material";

import { useTheme } from "@mui/system";
import { useTranslation } from 'react-i18next';

import UploadImageButton from "../components/UploadImageButton";
import BackgroundCard from "../components/BackgroundCard";
import BackgroundFilterButton from "../components/BackgroundFilterButton";


const CardBackgroundDialog = ({
    label = "Select background",
    open,
    onClose,
    backgrounds, localBackgrounds,
    addLocalBackground, deleteLocalBackground,
    value,
    name,
    onChange,
    onSave,
    onReset,
    userData,
}) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [filterType, setFilterType] = useState("all");

    const filteredLocalBackgrounds = Array.from(localBackgrounds.values()).filter((bg) => {
        if (filterType === "all") return true;
        if (filterType === "uploaded") return true;
        return bg.type?.includes(filterType);
    });

    const filteredRemoteBackgrounds = Array.from(backgrounds.values()).filter((bg) => {
        if (filterType === "all") return true;
        if (filterType === "uploaded") return false;
        return bg.type?.includes(filterType);
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            scroll="paper"
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
                    {label}
                </Typography>

                <BackgroundFilterButton
                    initialValue={filterType}
                    onValueChange={(newFilter) =>
                        setFilterType(newFilter)}
                />

            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2} columns={3}>

                    <Grid size={{ xs: 1 }}>
                        <UploadImageButton
                            label={t('add_background')}
                            onUpload={addLocalBackground}
                            fontSizeScale={1.3}
                        />
                    </Grid>

                    {filteredLocalBackgrounds.map((bg) => {
                        const isSelected = value === bg.id;

                        return (
                            <Grid key={bg.id} size={{ xs: 1 }}>
                                <BackgroundCard
                                    background={bg}
                                    selected={isSelected}
                                    onSelect={(id) => onChange({ target: { name, value: id } })}
                                    isLocalCard={true}
                                    deleteBackground={deleteLocalBackground}
                                    userData={userData}
                                />
                            </Grid>
                        );
                    })}

                    {filteredRemoteBackgrounds.map((bg) => {
                        const isSelected = value === bg.id;

                        return (
                            <Grid key={bg.id} size={{ xs: 1 }}>
                                <BackgroundCard
                                    background={bg}
                                    selected={isSelected}
                                    onSelect={(id) => onChange({ target: { name, value: id } })}
                                    userData={userData}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "12px", justifyContent: "space-between" }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onReset}
                    sx={{ alignSelf: "center" }}>
                    {t('button_reset')}
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ padding: "6px 14px 4px 14px" }}>
                        {t('button_cancel')}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onSave}
                        sx={{ padding: "6px 14px 4px 14px" }}>
                        {t('button_save')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CardBackgroundDialog;

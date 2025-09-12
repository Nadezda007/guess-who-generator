import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Button,
    TextField,
    MenuItem,
    Box,
    Slider,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import ColorPickerField from "../components/ColorPickerField";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import defaultUserData from "../../data/defaultUserData";

const CardSettingsDialog = ({ open, onClose, userData, setUserData }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [format, setFormat] = useState("jpg");

    const isJpg = format === "jpg";
    const isPng = format === "png";

    // Format change function (jpg/png)
    const handleFormatChange = (_, newFormat) => {
        if (newFormat) {
            setFormat(newFormat);
        }
    };

    // Updating userData state
    const handleChange = (field) => (eventOrValue) => {
        const value =
            typeof eventOrValue === "object" && eventOrValue.target
                ? eventOrValue.target.type === "checkbox"
                    ? eventOrValue.target.checked
                    : eventOrValue.target.value
                : eventOrValue;

        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const resetToDefaults = () => {
        setUserData(prev => ({
            ...defaultUserData,
            activeProfile: prev.activeProfile,
        }));
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
            <DialogTitle display="flex" sx={{ paddingBottom: "4px", justifyContent: "space-between", gap: 1 }}>
                <Box>
                    <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                        {t('cards_settings')}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            fontStyle: 'italic',
                        }}>
                        {t('card_picker_menu_only_hint')}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ overflow: "hidden" }} >

                <ColorPickerField
                    label={t('settings_card_background')}
                    value={userData.backgroundColor}
                    onChange={handleChange("backgroundColor")}
                    sx={{ mt: "12px" }}
                />

                <FormControlLabel
                    label={t('settings_show_name')}
                    sx={{ mt: 1, width: "100%" }}
                    control={
                        <Switch
                            checked={userData.showText}
                            onChange={handleChange("showText")}
                        />
                    }
                />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        {t('settings_font_size')} {userData.fontSize}px
                    </Typography>
                    <Slider
                        value={userData.fontSize}
                        min={8}
                        max={24}
                        step={1}
                        onChange={(_, value) => handleChange("fontSize")(value)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}px`}
                    />
                </Box>

                <Box
                    sx={{
                        padding: "12px 16px 4px 16px",
                        background: theme.palette.mode === "dark" ? "#222" : "#eee",
                        borderRadius: "16px",
                        mt: 1,
                    }}>
                    {/* --------- JPG / PNG SETTINGS --------- */}
                    <Box display="flex" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "16px", pl: "2px" }}>
                            {t('settings_for_label')} {format.toUpperCase()}
                        </Typography>

                        <ToggleButtonGroup
                            value={format}
                            onChange={handleFormatChange}
                            exclusive
                            sx={{ alignSelf: "center" }}>
                            <ToggleButton value="jpg" sx={{ padding: "6px 8px 4px 8px" }} >
                                jpg
                            </ToggleButton>
                            <ToggleButton value="png" sx={{ padding: "6px 8px 4px 8px" }}>
                                png
                            </ToggleButton>
                            <ToggleButton value="other" sx={{ padding: "6px 8px 4px 8px" }}>
                                other
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <TextField
                        label={t('image_insert_mode')}
                        value={isJpg ? userData.imageFitJpg : (isPng ? userData.imageFitPng : userData.imageFit)}
                        onChange={handleChange(isJpg ? "imageFitJpg" : (isPng ? "imageFitPng" : "imageFit"))}
                        select
                        fullWidth
                        sx={{ mt: 1.2 }}
                    >
                        <MenuItem value="contain">Contain</MenuItem>
                        <MenuItem value="cover">Cover</MenuItem>
                        <MenuItem value="fill">Fill</MenuItem>
                    </TextField>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" gutterBottom>
                            {t('edge_offset_label')} {isJpg ? userData.paddingJpg : (isPng ? userData.paddingPng : userData.padding)}px
                        </Typography>
                        <Slider
                            value={isJpg ? userData.paddingJpg : (isPng ? userData.paddingPng : userData.padding)}
                            min={0}
                            max={16}
                            step={1}
                            onChange={(_, value) => handleChange(isJpg ? "paddingJpg" : (isPng ? "paddingPng" : "padding"))(value)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}px`}
                        />
                    </Box>
                </Box>

                <Box sx={{ width: "100%" }}>
                    <FormControlLabel
                        label={t('settings_disable_interaction')}
                        sx={{ mt: 1, width: "100%" }}
                        control={
                            <Switch
                                checked={userData.disableInteraction}
                                onChange={handleChange("disableInteraction")}
                            />
                        }
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            fontStyle: 'italic',
                        }}>
                        {t('image_interaction_hint')}
                    </Typography>
                </Box>

            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px", justifyContent: "space-between" }} >
                <Button
                    variant="outlined"
                    color="error"
                    onClick={resetToDefaults}
                    sx={{ alignSelf: "center" }}>
                    {t('button_reset')}
                </Button>

                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CardSettingsDialog;

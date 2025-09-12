import React, { useRef, useEffect } from "react";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ColorPickerField from "../components/ColorPickerField";
import initialTeams from "../../data/initialTeams";

const EditTeamsDialog = ({ open, onClose, teams, setTeams }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const originalColorsRef = useRef(null);

    // Keep current colors when opening the dialog
    useEffect(() => {
        if (open) {
            originalColorsRef.current = Object.fromEntries(
                Object.entries(teams).map(([key, team]) => [key, team.color])
            );
        }
    }, [open]); // teams are not needed

    // Reset to initialTeams (colors only)
    const handleReset = () => {
        setTeams((prev) =>
            Object.fromEntries(
                Object.entries(prev).map(([key, team]) => [
                    key,
                    {
                        ...team,
                        color: initialTeams[key]?.color ?? team.color,
                    },
                ])
            )
        );
    };

    // Return to original colors
    const handleCancel = () => {
        if (originalColorsRef.current) {
            setTeams((prev) =>
                Object.fromEntries(
                    Object.entries(prev).map(([key, team]) => [
                        key,
                        {
                            ...team,
                            color: originalColorsRef.current[key] ?? team.color,
                        },
                    ])
                )
            );
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
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
            <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between" }}>
                <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                    {t("team_editing_title")}
                </Typography>

                <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ alignSelf: "center" }} >
                    {t('button_reset')}
                </Button>
            </DialogTitle>

            <DialogContent>
                {Object.entries(teams).map(([id, { name, color }], index) => (
                    <ColorPickerField
                        key={id}
                        label={t(name)}
                        name={id}
                        value={color}
                        sx={index === 0 ? { mt: 1 } : { mt: 2 }}
                        onChange={({ target: { name, value } }) => {
                            setTeams((prev) => ({
                                ...prev,
                                [name]: {
                                    ...prev[name],
                                    color: value,
                                },
                            }));
                        }}
                    />
                ))}
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_cancel')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTeamsDialog;

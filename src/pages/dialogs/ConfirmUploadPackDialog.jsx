import React, { useEffect, useState, useMemo } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    ToggleButtonGroup,
    ToggleButton,
    Divider,
    Grid,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';
import ScrollableBox from "../components/ScrollableBox";

const ConfirmUploadPackDialog = ({
    open, onClose, onSubmit,
    allCards, allCategories, allSets, allBackgrounds,
    preparedCards, preparedCategories, preparedSets, preparedBackgrounds
}) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [loading, setLoading] = useState(false);
    const [replaceMode, setReplaceMode] = useState(null); // 'skip' or 'replace'
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState([]);

    // Find duplicates by id
    const duplicateCards = useMemo(() => {
        if (!preparedCards || !allCards) return [];
        const existingIds = new Set(allCards.map(card => card.id));
        return preparedCards
            .filter(card => existingIds.has(card.id))
            .map(card => card.id);
    }, [preparedCards, allCards]);


    const duplicateCategories = useMemo(() => {
        if (!preparedCategories || !allCategories) return [];
        const existingIds = new Set(allCategories.map(c => c.id));
        return preparedCategories
            .filter(c => existingIds.has(c.id))
            .map(c => c.id);
    }, [preparedCategories, allCategories]);

    const duplicateSets = useMemo(() => {
        if (!preparedSets || !allSets) return [];
        const existingIds = new Set(allSets.map(set => set.id));
        return preparedSets
            .filter(set => existingIds.has(set.id))
            .map(set => set.id);
    }, [preparedSets, allSets]);

    const duplicateBackgrounds = useMemo(() => {
        if (!preparedBackgrounds || !allBackgrounds) return [];
        const existingIds = new Set(allBackgrounds.map(bg => bg.id));
        return preparedBackgrounds
            .filter(bg => existingIds.has(bg.id))
            .map(bg => bg.id);
    }, [preparedBackgrounds, allBackgrounds]);


    const noDuplicateCards = duplicateCards.length === 0;
    const noDuplicateCategories = duplicateCategories.length === 0;
    const noDuplicateSets = duplicateSets.length === 0;
    const noDuplicateBackgrounds = duplicateBackgrounds.length === 0;

    const noDuplicates =
        noDuplicateCards && noDuplicateCategories && noDuplicateSets && noDuplicateBackgrounds;

    // Calculation of statistics
    const stats = useMemo(() => {
        const cards = preparedCards?.length || 0;
        const categories = preparedCategories?.length || 0;
        const sets = preparedSets?.length || 0;
        const backgrounds = preparedBackgrounds?.length || 0;

        return {
            totalCards: cards,
            totalCategories: categories,
            totalSets: sets,
            totalBackgrounds: backgrounds,
        };
    }, [preparedCards, preparedCategories, preparedSets, preparedBackgrounds]);

    useEffect(() => {
        const info = [];
        if (selectedTypes.includes("cards")) {
            info.push(`${stats.totalCards} ${t('x_cards')}`);
        }
        if (selectedTypes.includes("categories")) {
            info.push(`${stats.totalCategories} ${t('x_categories')}`);
        }
        if (selectedTypes.includes("sets")) {
            info.push(`${stats.totalSets} ${t('x_sets')}`);
        }
        if (selectedTypes.includes("backgrounds")) {
            info.push(`${stats.totalBackgrounds} ${t('x_backgrounds')}`);
        }
        setSelectedInfo(info);
    }, [selectedTypes, stats]);


    useEffect(() => {
        if (!stats) return;

        const defaults = [];
        if (stats.totalCards > 0) defaults.push("cards");
        if (stats.totalCategories > 0) defaults.push("categories");
        if (stats.totalSets > 0) defaults.push("sets");
        if (stats.totalBackgrounds > 0) defaults.push("backgrounds");

        setSelectedTypes(defaults);
    }, [stats]);

    const handleConfirm = async () => {
        setLoading(true);
        await onSubmit(replaceMode); // Transfer the selected mode to the parent
        setLoading(false);
    };

    // Auxiliary renderer for blocks with duplicates
    const renderDuplicateSection = ({ title, duplicates }) => {
        if (!duplicates || duplicates.length === 0) return null;
        return (
            <>
                <Typography variant="subtitle2"
                    sx={{
                        padding: "4px 16px",
                        backgroundColor: theme.palette.action.hover
                    }}>
                    {title} ({duplicates.length}):
                </Typography>

                <Divider />

                <ScrollableBox>
                    <Box sx={{ maxHeight: "200px" }}>
                        <Grid container spacing={1} sx={{ padding: "8px 12px" }}>
                            {duplicates.map((id) => (

                                <Grid key={id}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            backgroundColor: theme.palette.action.hover,
                                            borderRadius: "6px",
                                            padding: "2px 6px",
                                        }}
                                    >
                                        {id}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </ScrollableBox>
            </>
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
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
                <DialogTitle>{t("upload_pack_confirmation")}</DialogTitle>

                {/* <ScrollableBox> */}
                <DialogContent sx={{ paddingTop: 0 }}>
                    {(!preparedCards && !preparedCategories && !preparedSets && !preparedBackgrounds) && (
                        <Typography>{t('uploading_no_data')}</Typography>
                    )}
                    {(preparedCards || preparedCategories || preparedSets || preparedBackgrounds) && (
                        <>
                            {/* Group of buttons with statistics */}
                            <ToggleButtonGroup
                                value={selectedTypes}
                                onChange={(e, newValues) => setSelectedTypes(newValues)}
                                aria-label="stats-toggle"
                                color="primary"
                                fullWidth
                                sx={{
                                    mb: 1,
                                    ".MuiButtonBase-root": {
                                        flexDirection: "column",
                                        padding: "12px 8px 8px 8px"
                                    },
                                }}
                            >

                                <ToggleButton value="cards" disabled={stats.totalCards === 0}>
                                    <ImageOutlinedIcon sx={{ marginBottom: "4px" }} />
                                    {stats.totalCards} {t("x_cards")}
                                </ToggleButton>
                                <ToggleButton value="categories" disabled={stats.totalCategories === 0}>
                                    <CategoryOutlinedIcon sx={{ marginBottom: "4px" }} />
                                    {stats.totalCategories} {t("x_categories")}
                                </ToggleButton>
                                <ToggleButton value="sets" disabled={stats.totalSets === 0}>
                                    <Inventory2OutlinedIcon sx={{ marginBottom: "4px" }} />
                                    {stats.totalSets} {t("x_sets")}
                                </ToggleButton>
                                <ToggleButton value="backgrounds" disabled={stats.totalBackgrounds === 0}>
                                    <TextureOutlinedIcon sx={{ marginBottom: "4px" }} />
                                    {stats.totalBackgrounds} {t("x_backgrounds")}
                                </ToggleButton>
                            </ToggleButtonGroup>


                            {noDuplicates && selectedInfo.length !== 0 && (
                                <Typography >
                                    {`${t('ready_to_upload')} ${selectedInfo.join(", ")}`}
                                </Typography>
                            )}

                            {/* Box with duplicates */}
                            {(duplicateCards.length > 0 ||
                                duplicateCategories.length > 0 ||
                                duplicateSets.length > 0 ||
                                duplicateBackgrounds.length > 0) && (
                                    <>
                                        <Typography variant="body1" gutterBottom sx={{ paddingX: "16px" }}>
                                            {t("duplicates_found")}
                                        </Typography>

                                        <Card
                                            variant="outlined"
                                            sx={{ borderRadius: "12px", }}
                                        >
                                            <CardContent sx={{ padding: "0px !important" }}>
                                                {[
                                                    { title: t("menu_cards"), duplicates: duplicateCards },
                                                    { title: t("menu_categories"), duplicates: duplicateCategories },
                                                    { title: t("menu_sets"), duplicates: duplicateSets },
                                                    { title: t("menu_backgrounds"), duplicates: duplicateBackgrounds },
                                                ]
                                                    .filter((section) => section.duplicates.length > 0)
                                                    .map((section, index, array) => (
                                                        <React.Fragment key={section.title}>
                                                            {renderDuplicateSection(section)}
                                                            {/* Divider only if not the last non-empty box */}
                                                            {index < array.length - 1 && <Divider />}
                                                        </React.Fragment>
                                                    ))}
                                            </CardContent>
                                        </Card>

                                        <Typography sx={{ mt: 1 }}>
                                            {t("choose_action_for_duplicates")}
                                        </Typography>
                                        <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
                                            <Button
                                                variant={
                                                    replaceMode === "skip"
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                onClick={() => setReplaceMode("skip")}
                                            >
                                                {t("button_skip")}
                                            </Button>
                                            <Button
                                                variant={
                                                    replaceMode === "replace"
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                color="error"
                                                onClick={() => setReplaceMode("replace")}
                                            >
                                                {t("button_replace")}
                                            </Button>
                                        </Box>
                                    </>
                                )}
                        </>
                    )}
                </DialogContent>
                {/* </ScrollableBox> */}

                <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ padding: "6px 14px 4px 14px" }}>
                        {t('button_cancel')}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleConfirm}
                        disabled={selectedInfo.length === 0}
                        sx={{ padding: "6px 14px 4px 14px" }}>
                        {t('button_upload')}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* LOADING */}
            <Backdrop
                open={loading}
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1, // above Dialog
                    color: "#fff",
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default ConfirmUploadPackDialog;

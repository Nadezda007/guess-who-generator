import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Backdrop,
    CircularProgress,
    Typography,
    Button,
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PackItemRow from "../components/PackItemRow";
import { downloadPack } from "../../hooks/downloadPack";

const DataManagerDialog = ({
    open, onClose,
    localCards, clearLocalCards,
    localCategories, clearLocalCategories,
    localSets, clearLocalSets,
    localBackgrounds, clearLocalBackgrounds,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const totalCards = localCards.size;
    const totalCategories = localCategories.size;
    const totalSets = localSets.size;
    const totalBackgrounds = localBackgrounds.size;

    const onDownloadAll = async () => {
        await downloadPack({
            cards: localCards,
            categories: localCategories,
            sets: localSets,
            backgrounds: localBackgrounds
        });
    }

    const onDownload = async (type) => {
        const dataMap = {
            cards: localCards,
            categories: localCategories,
            sets: localSets,
            backgrounds: localBackgrounds
        };

        if (!dataMap[type]) return;

        await downloadPack({
            [type]: dataMap[type]
        });
    };

    return (
        <>
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
                        {t('data_manager')}
                    </Typography>

                    <Button
                        variant="outlined"
                        color="warning"
                        sx={{ alignSelf: "center" }}
                        onClick={onDownloadAll}>
                        {t('download_all')}
                    </Button>
                </DialogTitle>

                <DialogContent>
                    <PackItemRow
                        label={t("menu_cards")}
                        count={totalCards}
                        onDownload={() => onDownload("cards")}
                        onDelete={() => clearLocalCards()}

                    />
                    <PackItemRow
                        label={t("menu_categories")}
                        count={totalCategories}
                        onDownload={() => onDownload("categories")}
                        onDelete={() => clearLocalCategories()}
                    />
                    <PackItemRow
                        label={t("menu_sets")}
                        count={totalSets}
                        onDownload={() => onDownload("sets")}
                        onDelete={() => clearLocalSets()}
                    />
                    <PackItemRow
                        label={t("menu_backgrounds")}
                        count={totalBackgrounds}
                        onDownload={() => onDownload("backgrounds")}
                        onDelete={() => clearLocalBackgrounds()}
                        sx={{ mb: 0 }}
                    />
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ padding: "6px 14px 4px 14px" }}>
                        {t('button_cancel')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* LOADING */}
            <Backdrop
                open={loading}
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    color: "#fff",
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default DataManagerDialog;

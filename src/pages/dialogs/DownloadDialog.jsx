import React, { useState, useEffect } from "react";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Backdrop,
    CircularProgress
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import StarIcon from '@mui/icons-material/Star';

import { paperDefaultScaleFactor } from "../../data/constants";
import downloadImagesAsZip from "../../hooks/downloadImagesAsZip";
import downloadAsPDF from "../../hooks/downloadAsPDF";

// const RecommendedIcon = (
//     <StarIcon sx={{ fontSize: 14, ml: 0.4, color: "#fbc02d" }} />
// );

const DownloadDialog = ({ open, onClose, paperWidth, paperHeight, paperOrientation, paperFormat }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [loading, setLoading] = useState(false);

    const [dpi, setDpi] = useState(600);
    const [imageFormat, setImageFormat] = useState("png");
    const [downloadMode, setDownloadMode] = useState("file");

    function mmToPx(mm) {
        const MM_PER_INCH = 25.4;
        return (mm / MM_PER_INCH) * dpi;
    }

    const imgWidth = mmToPx(paperWidth).toFixed();
    const imgHeight = mmToPx(paperHeight).toFixed();

    const [shouldRestorePng, setShouldRestorePng] = useState(false);

    useEffect(() => {
        if (downloadMode === "pdf") {
            if (imageFormat === "png") {
                setShouldRestorePng(true); // remembered that the user wanted png
            } else {
                setShouldRestorePng(false); // no need to return png
            }
            setImageFormat("jpeg"); // switch to jpeg
        } else if (downloadMode === "file") {
            if (shouldRestorePng) {
                setImageFormat("png"); // return png
            }
        }
    }, [downloadMode]);

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

                <DialogTitle sx={{ paddingBottom: 1 }}>
                    <Box>
                        <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                            {t('save_settings')}
                        </Typography>
                        {/* <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                fontStyle: 'italic',
                            }}>
                            *Recommended settings for high-quality printing
                        </Typography> */}
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ overflow: "hidden" }} >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: "4px"
                    }}>
                        <Typography variant="subtitle2" >
                            {t('resolution')}
                        </Typography>
                        <Typography variant="subtitle2" color="primary">
                            {imgWidth} x {imgHeight} {t('unit_px')}
                        </Typography>
                    </Box>

                    <ToggleButtonGroup
                        value={dpi}
                        onChange={(_, value) => setDpi(value)}
                        exclusive
                        fullWidth
                        sx={{ alignSelf: "center", marginBottom: "12px" }}>
                        <ToggleButton value={300} sx={{ padding: "6px 10px" }} >
                            300 dpi
                        </ToggleButton>
                        <ToggleButton value={600} sx={{ padding: "6px 10px", alignItems: "start" }}>
                            600 dpi
                            {/* {RecommendedIcon} */}
                        </ToggleButton>
                        <ToggleButton value={1200} sx={{ padding: "6px 10px" }}>
                            1200 dpi
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Typography variant="subtitle2" sx={{ mb: "4px" }}>{t('image_format')}</Typography>
                    <ToggleButtonGroup
                        value={imageFormat}
                        onChange={(_, value) => setImageFormat(value)}
                        exclusive
                        fullWidth
                        sx={{ alignSelf: "center", marginBottom: "12px" }}>
                        <ToggleButton value={"jpeg"} sx={{ padding: "6px 10px" }} >
                            jpeg
                        </ToggleButton>
                        <ToggleButton value={"png"} disa disabled={downloadMode === "pdf"} sx={{ padding: "6px 10px", alignItems: "start" }}>
                            png
                            {/* {RecommendedIcon} */}
                        </ToggleButton>

                    </ToggleButtonGroup>

                    <Typography variant="subtitle2" sx={{ mb: "4px" }}>{t('file_type')}</Typography>
                    <ToggleButtonGroup
                        value={downloadMode}
                        onChange={(_, value) => setDownloadMode(value)}
                        exclusive
                        fullWidth
                        sx={{ alignSelf: "center", marginBottom: "12px" }}>
                        <ToggleButton value={"pdf"} sx={{ padding: "6px 10px" }} >
                            pdf
                        </ToggleButton>
                        <ToggleButton value={"file"} sx={{ padding: "6px 10px", alignItems: "start" }}>
                            file (zip)
                            {/* {RecommendedIcon} */}
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        startIcon={< FileDownloadOutlinedIcon />}
                        variant="contained"

                        onClick={async () => {
                            setLoading(true);
                            const scale = mmToPx(paperWidth) / (paperDefaultScaleFactor * paperWidth);
                            if (downloadMode === "file") {
                                await downloadImagesAsZip({
                                    scale: scale,
                                    imageFormat: imageFormat
                                });
                            } else {
                                await downloadAsPDF({
                                    scale: scale,
                                    imageFormat: imageFormat,
                                    // imgWidth: imgWidth, imgHeight: imgHeight,
                                    imgWidth: paperWidth, imgHeight: paperHeight,
                                    paperOrientation: paperOrientation,
                                    paperFormat: paperFormat,
                                });
                            }
                            setLoading(false);
                            onClose();
                        }}
                        size="large"
                        fullWidth
                        sx={{ mt: "4px", paddingY: "10px" }}>
                        {t('download')}
                    </Button>
                </DialogContent>

            </Dialog >

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

export default DownloadDialog;

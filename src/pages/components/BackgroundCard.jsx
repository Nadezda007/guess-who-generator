import React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/system";

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getJsonTranslation } from "../../i18n/getJsonTranslation";

const BackgroundCard = ({
    background,
    selected,
    onSelect,
    isLocalCard = false,
    deleteBackground,
    userData
}) => {
    const theme = useTheme();

    const alphaBackground = alpha(theme.palette.background.default, 0.6);
    const alphaPrimary = alpha(theme.palette.primary.light, 0.6);

    const backgroundName = getJsonTranslation(background.name, userData);
    const backgroundImage = isLocalCard
        ? background.imageURL || background.image
        : import.meta.env.BASE_URL + `backgrounds/images/${background.imagePath}`;

    return (
        <Card
            onClick={() => onSelect(background.id)}
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                aspectRatio: 3 / 4,
                border: selected ? "3px solid" : "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                boxShadow: "none",
                justifyContent: "end",
                overflow: "hidden",
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            {/* ------- EDIT BUTTON ------- */}
            {
                isLocalCard && (
                    <Box
                        onClick={() => {
                            deleteBackground(background.id);
                        }}
                        sx={{
                            display: "flex",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: alphaBackground,
                            borderLeft: "1px solid",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            borderBottomLeftRadius: "4px",
                            padding: "2px",
                            cursor: "pointer",
                            zIndex: 2,
                            "&:hover": {
                                backgroundColor: alphaPrimary,
                            },
                        }}
                    >
                        <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    </Box>

                )
            }

            <CardMedia
                component="img"
                image={backgroundImage}
                alt={backgroundName}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = import.meta.env.BASE_URL + "logo512.png";
                }}

                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    overflowClipMargin: "unset",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            {backgroundName && (
                <Box
                    sx={{
                        width: "100%",
                        position: "absolute",
                        padding: selected ? "2px" : "2px 4px",
                        backgroundColor: alpha(theme.palette.background.default, 0.7),
                        zIndex: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        }}
                    >
                        {backgroundName}
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default BackgroundCard;

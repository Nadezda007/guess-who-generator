import React, { useState } from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { alpha } from "@mui/system";

import EditCardDialog from "../dialogs/EditCardDialog";
import EditLocalCardDialog from "../dialogs/EditLocalCardDialog";
import { getJsonTranslation } from "../../i18n/getJsonTranslation";

const CardItem = React.memo(({
    card,
    editedCards, setEditedCards,
    isSelected,
    onClick,
    isLocalCard = false,
    updateLocalCard, deleteLocalCard,
    userData
}) => {
    const theme = useTheme();
    const alphaBackground = alpha(theme.palette.background.default, 0.6);
    const alphaPrimary = alpha(theme.palette.primary.light, 0.6);

    const [isEditingOpen, setEditingOpen] = useState(false);

    // State for tracking mouse pointer
    const [isHovered, setIsHovered] = useState(false);

    const customCard = editedCards?.[card.id];
    const cardName = isLocalCard
        ? getJsonTranslation(card.name, userData)
        : getJsonTranslation(customCard?.name, userData) || getJsonTranslation(card.name, userData);
    const cardImage = isLocalCard
        ? card.imageURL || card.image
        : customCard?.imageURL || import.meta.env.BASE_URL + `cards/images/${card.imagePath}`;

    const getImageFormat = () => {
        if (!cardImage) return null;

        if (cardImage.startsWith("data:image/png")) return "png";
        if (cardImage.startsWith("data:image/jpg")) return "jpg";
        if (cardImage.startsWith("data:image/jpeg")) return "jpg";

        const lower = cardImage.toLowerCase();
        if (lower.endsWith(".png")) return "png";
        if (lower.endsWith(".jpg")) return "jpg";
        if (lower.endsWith(".jpeg")) return "jpg";

        return null;
    };

    // Determine which format to use
    const imageFormat = getImageFormat();
    const isPng = imageFormat === "png";
    const isJpg = imageFormat === "jpg";

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                width: 72,
                aspectRatio: 3 / 4,
                // background: theme.palette.background.paper,
                borderRadius: "4px",
                border: isSelected ? "3px solid" : "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                boxShadow: "none",
                justifyContent: "end",
                overflow: "hidden",
                cursor: "pointer",
                userSelect: userData.disableInteraction ? "none" : "auto",
            }}
            onClick={!isEditingOpen ? onClick : undefined}
            onMouseEnter={!isEditingOpen ? (() => setIsHovered(true)) : undefined}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* ------- EDIT BUTTON ------- */}
            {
                isHovered && (
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsHovered(false);
                            setEditingOpen(true);
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
                        <EditIcon sx={{ fontSize: 16 }} />
                    </Box>

                )
            }

            {isLocalCard ? (
                <EditLocalCardDialog
                    open={isEditingOpen}
                    onClose={() => setEditingOpen(false)}
                    card={card}
                    updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                    userData={userData}
                />
            ) : (
                <EditCardDialog
                    open={isEditingOpen}
                    onClose={() => setEditingOpen(false)}
                    card={card}
                    editedCards={editedCards}
                    setEditedCards={setEditedCards}
                    userData={userData}
                />
            )}

            {/* ------- IMAGE BOX ------- */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    height: "0%",
                    backgroundColor: userData.backgroundColor,
                    zIndex: 0,
                }}
            >
                {/* ------- IMAGE ------- */}
                <CardMedia
                    component="img"
                    image={cardImage}
                    alt={cardName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = import.meta.env.BASE_URL + "logo512.png";
                    }}

                    sx={{
                        padding: `${isJpg ? userData.paddingJpg : (isPng ? userData.paddingPng : userData.padding)}px`,
                        objectFit: isJpg ? userData.imageFitJpg : (isPng ? userData.imageFitPng : userData.imageFit),
                        overflow: "hidden",
                        overflowClipMargin: "unset",
                        pointerEvents: userData.disableInteraction ? "none" : "auto",
                    }}
                />
            </Box>

            {/* ------- TEXT BOX ------- */}
            {(userData.showText && cardName) && (
                <Box
                    width="100%"
                    alignContent="center"
                    sx={{ padding: "2px 4px", zIndex: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: `${userData.fontSize}px`,
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            textDecoration: getJsonTranslation(customCard?.name, userData) ? "underline" : "none",
                        }}>
                        {cardName}
                    </Typography>
                </Box>
            )}
        </Card >
    );
});

export default CardItem;

import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/system";

import PatternedBackground from "../components/PatternedBackground";
import generateOutlineShadows from "../../hooks/generateOutlineShadows";
import generateRandomString from "../../utils/generateRandomString";
import { getJsonTranslation } from "../../i18n/getJsonTranslation";

const PrintedCard = React.memo(({
    card, editedCards,
    cardWidth, cardHeight,
    isLocalCard = false,
    backgrounds, localBackgrounds,
    team, markFront = false,
    settings, userData
}) => {
    const isTeamExists = team;
    const customCard = editedCards?.[card.id];
    const isTextPositionDown = settings.textPosition === "down";

    const getTransformedText = (text) => {
        if (settings.textCase === "uppercase") return text.toUpperCase();
        if (settings.textCase === "lowercase") return text.toLowerCase();
        return text;
    };

    const cardName = getTransformedText(isLocalCard
        ? getJsonTranslation(card.name, userData)
        : getJsonTranslation(customCard?.name, userData) || getJsonTranslation(card.name, userData));
    const cardImage = isLocalCard
        ? card.imageURL || card.image
        : customCard?.imageURL || import.meta.env.BASE_URL + `cards/images/${card.imagePath}`;

    const cardBackground = backgrounds.get(settings.cardBackground);
    const cardLocalBackground = localBackgrounds.get(settings.cardBackground);
    const cardBackgroundImage = (cardLocalBackground || cardBackground)
        ? cardLocalBackground
            ? cardLocalBackground.imageURL || cardLocalBackground.image
            : import.meta.env.BASE_URL + `backgrounds/images/${cardBackground.imagePath}`
        : null;

    const patternSeed = useMemo(() => {
        return settings.uniquePatternSeed
            ? generateRandomString()
            : settings.patternSeed;
    }, [
        settings.uniquePatternSeed,
        settings.patternSeed,
    ]);

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

    const uniqueMaskId = `border-mask-card`;
    const isCssBorder = settings.cardBorderVersion === "css";
    const isSvgBorder = settings.cardBorderVersion === "svg";

    const getMarkerStyle = (position, style, size, padding, color) => {
        const markerColor = (isTeamExists && settings.markerColorUseTeamColor)
            ? alpha(team.color, settings.markerOpacity)
            : alpha(settings.markerColor, settings.markerOpacity);

        // Lines
        if (style === "line") {
            const isVertical = (position.split("-")[0] === "top")
                || (position.split("-")[0] === "bottom");

            return {
                width: isVertical ? `${cardWidth}px` : `${size / 2}px`,
                height: isVertical ? `${size / 2}px` : `${cardHeight}px`,
                backgroundColor: markerColor,
                [position.split("-")[0]]: 0,
            };
        }

        // Triangles
        if (style === "triangle") {
            switch (position) {
                case "top-left":
                    return { top: padding, left: padding, borderTop: `${size}px solid ${markerColor}`, borderRight: `${size}px solid transparent` };
                case "right-top":
                    return { top: padding, right: padding, borderTop: `${size}px solid ${markerColor}`, borderLeft: `${size}px solid transparent` };
                case "left-bottom":
                    return { bottom: padding, left: padding, borderBottom: `${size}px solid ${markerColor}`, borderRight: `${size}px solid transparent` };
                case "bottom-right":
                    return { bottom: padding, right: padding, borderBottom: `${size}px solid ${markerColor}`, borderLeft: `${size}px solid transparent` };
                default:
                    return {};
            }
        }

        // Circles
        return {
            width: size,
            height: size,
            backgroundColor: markerColor,
            borderRadius: "50%",
            [position.split("-")[0]]: padding,
            [position.split("-")[1]]: padding,
        };
    };
    // zIndex
    // main - 10
    // back - 0
    // pattern - 1
    // border - 2
    // image - 3
    // back - 4
    // border - 5
    // image - 6
    // text - 7
    // marker - 8

    const textBoxX = settings.textBoxPaddingX;
    const textBoxWidth = cardWidth - (2 * settings.textBoxPaddingX);
    const textBoxHeight = settings.textBoxMinHeight;
    const textBoxY = settings.textPosition === "down"
        ? cardHeight - settings.textBoxPaddingY - textBoxHeight
        : settings.textBoxPaddingY;


    return (
        //  {/* ------- MAIN ------- */ }
        <Box
            sx={{
                display: "flex",
                position: "relative",
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                // margin: `${settings.gridWidth}px`,
                borderRadius: settings.cardBorderClipContent
                    ? settings.cardBorderVersion === "css"
                        ? `${settings.cardBorderOuterRadiusCss}px`
                        : `${settings.cardBorderOuterRadiusSvg}px`
                    : null,
                boxShadow: `0 0 0 ${settings.gridWidth}px ${settings.gridColor}`,
                alignItems: "center",
                justifyContent: isTextPositionDown ? "end" : "start",
                flexDirection: isTextPositionDown ? "column" : "column-reverse",
                overflow: "hidden",
                userSelect: userData.disableInteraction ? "none" : "auto",
                pointerEvents: userData.disableInteraction ? "none" : "auto",
                zIndex: 10,
            }}
        >
            {/* ------- TEAM MARKER ------- */}
            {isTeamExists && markFront && (
                <Box
                    sx={{
                        position: "absolute",
                        ...getMarkerStyle(
                            settings.markerPosition,
                            settings.markerStyle,
                            settings.markerSize,
                            settings.markerPadding,
                            team.color),
                        zIndex: 8,
                    }}
                ></Box>
            )}

            {/* ------- BACKGROUND ------- */}
            {cardBackgroundImage && (
                <Box
                    component="img"
                    src={cardBackgroundImage}
                    alt={(cardLocalBackground?.id || cardBackground?.id)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = import.meta.env.BASE_URL + "logo512.png";
                    }}

                    sx={{
                        display: "flex",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: settings.cardBackgroundFit,
                        opacity: settings.cardBackgroundOpacity,
                        filter: ` blur(${settings.cardBackgroundBlur}px)
                            brightness(${settings.cardBackgroundBrightness}) 
                            saturate(${settings.cardBackgroundSaturate}) 
                            contrast(${settings.cardBackgroundContrast}) 
                            hue-rotate(${settings.cardBackgroundHueRotate}deg)`,
                        overflow: "hidden",
                        overflowClipMargin: "unset",
                        zIndex: settings.cardBackgroundOverImage ? 4 : 0,
                    }}
                />
            )}

            {/* ------- CSS BORDER ------- */}
            {settings.showCardBorder && isCssBorder && (
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        borderStyle: settings.cardBorderStyleCss,
                        borderWidth: `${settings.cardBorderWidthTopCss}px ${settings.cardBorderWidthXCss}px 
                                    ${settings.cardBorderWidthBottomCss}px ${settings.cardBorderWidthXCss}px`,
                        borderColor: (isTeamExists && settings.cardBorderUseTeamColorCss)
                            ? team.color
                            : settings.cardBorderColorCss,
                        borderRadius: `${settings.cardBorderOuterRadiusCss}px`,
                        zIndex: settings.cardBorderOverImageCss ? 5 : 2,
                    }}
                />
            )}

            {/* ------- SVG BORDER ------- */}
            {settings.showCardBorder && isSvgBorder && (
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        backgroundColor: "transparent",
                        zIndex: settings.cardBorderOverImageSvg ? 5 : 2,
                    }}
                >
                    <svg
                        width={cardWidth}
                        height={cardHeight}
                        style={{ position: "absolute", top: 0, left: 0 }}>
                        <defs>
                            <mask id={uniqueMaskId}>
                                {/* The entire area is white (fully visible) */}
                                <rect mask={`url(#${uniqueMaskId})`}
                                    x="0"
                                    y="0"
                                    width={cardWidth}
                                    height={cardHeight}
                                    fill="white"
                                    rx={settings.cardBorderOuterRadiusSvg}
                                    ry={settings.cardBorderOuterRadiusSvg}
                                />
                                {/* Cut out the inner part (black — will become transparent) */}
                                <rect mask={`url(#${uniqueMaskId})`}
                                    x={settings.cardBorderWidthXSvg}
                                    y={settings.cardBorderWidthTopSvg}
                                    width={cardWidth - (2 * settings.cardBorderWidthXSvg)}
                                    height={(cardHeight - settings.cardBorderWidthTopSvg) - settings.cardBorderWidthBottomSvg}
                                    fill="black"
                                    rx={settings.cardBorderInnerRadiusSvg}
                                    ry={settings.cardBorderInnerRadiusSvg}
                                />
                                {settings.cutTextFromBorderSvg && (
                                    <rect
                                        x={textBoxX}
                                        y={textBoxY}
                                        width={textBoxWidth}
                                        height={textBoxHeight}
                                        fill="black"
                                        rx={settings.textBoxBorderRadius}
                                        ry={settings.textBoxBorderRadius}
                                    />
                                )}
                            </mask>
                        </defs>

                        {/* Painting with a masking rectangle */}
                        <rect mask={`url(#${uniqueMaskId})`}
                            x="0"
                            y="0"
                            width={cardWidth}
                            height={cardHeight}
                            fill={(isTeamExists && settings.cardBorderUseTeamColorSvg)
                                ? team.color
                                : settings.cardBorderColorSvg}
                            rx={settings.cardBorderOuterRadiusSvg}
                            ry={settings.cardBorderOuterRadiusSvg}
                        />
                    </svg>
                </Box>
            )}

            {/* ------- PatternedBackground ------- */}
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    backgroundColor: (isTeamExists && settings.patternBackgroundUseTeamColor)
                        ? team.color
                        : settings.patternBackgroundColor,
                    zIndex: 1,
                }}
            >
                <PatternedBackground
                    width={cardWidth}
                    height={cardHeight}
                    seed={patternSeed}
                    color={(isTeamExists && settings.patternUseTeamColor)
                        ? team.color
                        : settings.patternColor}
                    shapesCount={settings.patternShapesCount}
                    shapeTypes={settings.patternSelectedShapes}
                    minSize={settings.patternMinSize}
                    maxSize={settings.patternMaxSize}
                    minOpacity={settings.patternMinOpacity}
                    maxOpacity={settings.patternMaxOpacity}
                    minRotate={settings.patternMinRotate}
                    maxRotate={settings.patternMaxRotate}
                    deadZone={settings.patternDeadZone}
                />
            </Box>

            {/* ------- IMAGE BOX ------- */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    height: "0%",
                    backgroundColor: settings.cardBackgroundColor,
                    zIndex: settings.imageOverEverything ? 6 : 3,
                }}
            >
                {/* ------- IMAGE ------- */}
                <Box
                    component="img"
                    src={cardImage}
                    alt={cardName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = import.meta.env.BASE_URL + "logo512.png";
                    }}

                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: isJpg ? settings.imageFitJpg : (isPng ? settings.imageFitPng : settings.imageFit),
                        padding: isJpg
                            ? `${settings.imagePaddingTopJpg}px ${settings.imagePaddingXJpg}px ${settings.imagePaddingBottomJpg}px ${settings.imagePaddingXJpg}px`
                            : (isPng
                                ? `${settings.imagePaddingTopPng}px ${settings.imagePaddingXPng}px ${settings.imagePaddingBottomPng}px ${settings.imagePaddingXPng}px`
                                : `${settings.imagePaddingTop}px ${settings.imagePaddingX}px ${settings.imagePaddingBottom}px ${settings.imagePaddingX}px`),
                        overflow: "hidden",
                        overflowClipMargin: "unset",
                    }}
                />
            </Box >


            {/* ------- TEXT BOX ------- */}
            {
                (settings.showText && cardName) && (
                    <Box
                        sx={{
                            width: `calc(100% - ${settings.textBoxPaddingX * 2}px)`,
                            minHeight: `${settings.textBoxMinHeight}px`,
                            position: settings.textOverlay ? "absolute" : "relative",
                            alignContent: "center",
                            top: isTextPositionDown ? null : `${settings.textBoxPaddingY}px`,
                            bottom: isTextPositionDown ? `${settings.textBoxPaddingY}px` : null,
                            borderRadius: `${settings.textBoxBorderRadius}px`,
                            backgroundColor: settings.textBackgroundColor,
                            zIndex: 7,
                        }}>

                        <div
                            style={{
                                display: "block",
                                width: "100%",
                                direction: "ltr",
                                padding: `${settings.textPaddingY}px ${settings.textPaddingX}px`,
                                transform: `rotate(${settings.textBoxRotate}deg)`,
                                fontFamily: settings.fontFamily,
                                fontStyle: settings.fontStyle,
                                color: isJpg ? settings.textColorJpg : (isPng ? settings.textColorPng : settings.textColor),
                                fontSize: `${isJpg ? settings.fontSizeJpg : (isPng ? settings.fontSizePng : settings.fontSize)}px`,
                                fontWeight: isJpg ? settings.fontWeightJpg : (isPng ? settings.fontWeightPng : settings.fontWeight),
                                letterSpacing: isJpg ? settings.letterSpacingJpg : (isPng ? settings.letterSpacingPng : settings.letterSpacing),
                                whiteSpace: settings.textSingleLine ? "nowrap" : "normal",
                                textOverflow: settings.textEllipsis ? "ellipsis" : "clip",
                                textAlign: settings.textAlign,
                                lineHeight: isJpg ? settings.textLineHeightJpg : (isPng ? settings.textLineHeightPng : settings.textLineHeight),
                                overflow: "hidden",
                                textShadow: generateOutlineShadows(
                                    isJpg ? settings.textOutlineWidthJpg : (isPng ? settings.textOutlineWidthPng : settings.textOutlineWidth),
                                    isJpg ? settings.textOutlineBlurJpg : (isPng ? settings.textOutlineBlurPng : settings.textOutlineBlur),
                                    isJpg ? settings.textOutlineColorJpg : (isPng ? settings.textOutlineColorPng : settings.textOutlineColor),
                                    settings.textOutlineDetailing
                                ),
                            }}
                        >
                            {cardName}
                        </div>
                    </Box >
                )
            }
        </Box >
    );
});

export default PrintedCard;

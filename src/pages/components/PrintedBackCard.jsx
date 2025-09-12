import React, { useMemo } from "react";
import { Box } from "@mui/material";

import PatternedBackground from "../components/PatternedBackground";
import generateOutlineShadows from "../../hooks/generateOutlineShadows";
import generateRandomString from "../../utils/generateRandomString";

const PrintedBackCard = React.memo(({
    cardWidth, cardHeight,
    backgrounds, localBackgrounds,
    team,
    settings, userData
}) => {
    const isTeamExists = team;

    const uniqueMaskId = `border-mask-back-card`;
    const isCssBorder = settings.backCardBorderVersion === "css";
    const isSvgBorder = settings.backCardBorderVersion === "svg";

    const getTransformedText = (text) => {
        if (settings.backCardTextCase === "uppercase") return text.toUpperCase();
        if (settings.backCardTextCase === "lowercase") return text.toLowerCase();
        return text;
    };

    const cardBackground = backgrounds.get(settings.backCardBackground);
    const cardLocalBackground = localBackgrounds.get(settings.backCardBackground);
    const cardBackgroundImage = (cardLocalBackground || cardBackground)
        ? cardLocalBackground
            ? cardLocalBackground.imageURL || cardLocalBackground.image
            : import.meta.env.BASE_URL + `backgrounds/images/${cardBackground.imagePath}`
        : null;

    const patternSeed = useMemo(() => {
        return settings.backCardUniquePatternSeed
            ? generateRandomString()
            : settings.backCardPatternSeed;
    }, [
        settings.backCardUniquePatternSeed,
        settings.backCardPatternSeed,
    ]);

    return (
        <Box
            sx={{
                display: "flex",
                position: "relative",
                flexDirection: "column",
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                // margin: `${settings.gridWidth}px`,
                borderRadius: settings.backCardBorderClipContent
                    ? settings.backCardBorderVersion === "css"
                        ? `${settings.backCardBorderOuterRadiusCss}px`
                        : `${settings.backCardBorderOuterRadiusSvg}px`
                    : null,
                boxShadow: `0 0 0 ${settings.gridWidth}px ${settings.gridColor}`,
                alignItems: "center",
                overflow: "hidden",
                userSelect: userData.disableInteraction ? "none" : "auto",
                pointerEvents: userData.disableInteraction ? "none" : "auto",
                zIndex: 10,
            }}
        >

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
                        objectFit: settings.backCardBackgroundFit,
                        opacity: settings.backCardBackgroundOpacity,
                        filter: ` blur(${settings.backCardBackgroundBlur}px)
                            brightness(${settings.backCardBackgroundBrightness}) 
                            saturate(${settings.backCardBackgroundSaturate}) 
                            contrast(${settings.backCardBackgroundContrast}) 
                            hue-rotate(${settings.backCardBackgroundHueRotate}deg)`,
                        overflow: "hidden",
                        overflowClipMargin: "unset",
                        zIndex: settings.backCardBackgroundOverImage ? 4 : 0,
                    }}
                />
            )}

            {/* ------- CSS BORDER ------- */}
            {settings.showBackCardBorder && isCssBorder && (
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        borderStyle: settings.backCardBorderStyleCss,
                        borderWidth: `${settings.backCardBorderWidthTopCss}px ${settings.backCardBorderWidthXCss}px 
                                    ${settings.backCardBorderWidthBottomCss}px ${settings.backCardBorderWidthXCss}px`,
                        borderColor: (isTeamExists && settings.backCardBorderUseTeamColorCss)
                            ? team.color
                            : settings.backCardBorderColorCss,
                        borderRadius: `${settings.backCardBorderOuterRadiusCss}px`,
                        zIndex: settings.backCardBorderOverImageCss ? 5 : 2,
                    }}
                />
            )}

            {/* ------- SVG BORDER ------- */}
            {settings.showBackCardBorder && isSvgBorder && (
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        backgroundColor: "transparent",
                        zIndex: settings.backCardBorderOverImageSvg ? 5 : 2,
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
                                    rx={settings.backCardBorderOuterRadiusSvg}
                                    ry={settings.backCardBorderOuterRadiusSvg}
                                />
                                {/* Cut out the inner part (black — will become transparent) */}
                                <rect mask={`url(#${uniqueMaskId})`}
                                    x={settings.backCardBorderWidthXSvg}
                                    y={settings.backCardBorderWidthTopSvg}
                                    width={cardWidth - (2 * settings.backCardBorderWidthXSvg)}
                                    height={(cardHeight - settings.backCardBorderWidthTopSvg) - settings.backCardBorderWidthBottomSvg}
                                    fill="black"
                                    rx={settings.backCardBorderInnerRadiusSvg}
                                    ry={settings.backCardBorderInnerRadiusSvg}
                                />
                            </mask>
                        </defs>

                        {/* Painting with a masking rectangle */}
                        <rect mask={`url(#${uniqueMaskId})`}
                            x="0"
                            y="0"
                            width={cardWidth}
                            height={cardHeight}
                            fill={(isTeamExists && settings.backCardBorderUseTeamColorSvg)
                                ? team.color
                                : settings.backCardBorderColorSvg}
                            rx={settings.backCardBorderOuterRadiusSvg}
                            ry={settings.backCardBorderOuterRadiusSvg}
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
                    backgroundColor: (isTeamExists && settings.backCardPatternBackgroundUseTeamColor)
                        ? team.color
                        : settings.backCardPatternBackgroundColor,
                    zIndex: 1,
                }}
            >
                <PatternedBackground
                    width={cardWidth}
                    height={cardHeight}
                    seed={patternSeed}
                    color={(isTeamExists && settings.backCardPatternUseTeamColor)
                        ? team.color
                        : settings.backCardPatternColor}
                    shapesCount={settings.backCardPatternShapesCount}
                    shapeTypes={settings.backCardPatternSelectedShapes}
                    minSize={settings.backCardPatternMinSize}
                    maxSize={settings.backCardPatternMaxSize}
                    minOpacity={settings.backCardPatternMinOpacity}
                    maxOpacity={settings.backCardPatternMaxOpacity}
                    minRotate={settings.backCardPatternMinRotate}
                    maxRotate={settings.backCardPatternMaxRotate}
                    deadZone={settings.backCardPatternDeadZone}
                />
            </Box>

            {/* ------- TEXT BOX ------- */}
            {
                (settings.backCardText) && (
                    <Box
                        sx={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            alignContent: settings.backCardTextPosition,
                            transform: `rotate(${settings.backCardTextBoxRotate}deg)`,
                            zIndex: 6,
                        }}>

                        <div
                            style={{
                                display: "block",
                                direction: "ltr",
                                padding: `${settings.backCardTextPaddingTop}px ${settings.backCardTextPaddingRight}px ${settings.backCardTextPaddingBottom}px ${settings.backCardTextPaddingLeft}px`,
                                fontFamily: settings.backCardFontFamily,
                                fontStyle: settings.backCardFontStyle,
                                color: settings.backCardTextColor,
                                fontSize: `${settings.backCardFontSize}px`,
                                fontWeight: settings.backCardFontWeight,
                                letterSpacing: settings.backCardLetterSpacing,
                                textAlign: settings.backCardTextAlign,
                                lineHeight: settings.backCardTextLineHeight,
                                overflow: "hidden",
                                textShadow: generateOutlineShadows(
                                    settings.backCardTextOutlineWidth,
                                    settings.backCardTextOutlineBlur,
                                    settings.backCardTextOutlineColor,
                                    settings.backCardTextOutlineDetailing
                                ),
                            }}
                        >
                            {getTransformedText(settings.backCardText)}
                        </div>
                    </Box >
                )
            }

        </Box >
    );
});

export default PrintedBackCard;

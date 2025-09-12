import React, { useState } from "react";
import {
    Collapse,
    ListItemButton,
    ListItemIcon,
    Typography,
    Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useTheme } from "@mui/material";
import { alpha } from "@mui/system";

const CollapseField = ({
    image,
    icon: IconComponent,
    subIcon,
    title,
    subtitle,
    counter,
    onClick,
    children,
    sx,
    defaultExpanded = false,
    hoverOnExpand = true,
    muted = false,
    disabled = false,
}) => {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleToggle = () => {
        if (disabled) return;
        setExpanded(!expanded);
        if (onClick) onClick();
    };

    return (
        <Box
            sx={{
                opacity: disabled ? 0.5 : 1, //  visually gray
                pointerEvents: disabled ? "none" : "auto", // click disabling
                ...sx,
            }}
        >
            <ListItemButton
                onClick={handleToggle}
                sx={{
                    backgroundColor: expanded && hoverOnExpand && !disabled
                        ? "action.hover"
                        : "inherit",
                    transition: "background-color 0.3s ease",
                    cursor: disabled ? "default" : "pointer",
                }}
            >
                {(IconComponent || image) && (

                    // <ListItemIcon sx={{ minWidth: "0", paddingRight: "16px" }}>
                    //     {IconComponent ? (
                    //         <IconComponent
                    //             sx={{
                    //                 fontSize: 28,
                    //                 color: disabled ? "text.disabled" : "primary.main",
                    //             }}
                    //         />
                    //     ) : image ? (
                    //         <img
                    //             src={image}
                    //             alt={title}
                    //             style={{
                    //                 width: 36,
                    //                 height: 36,
                    //                 filter: disabled ? "grayscale(100%) opacity(0.6)" : "none",
                    //             }}
                    //         />
                    //     ) : null}
                    // </ListItemIcon>

                    <ListItemIcon sx={{ position: "relative", minWidth: "0", paddingRight: "16px" }}>
                        <Box sx={{
                            position: "relative",
                            width: IconComponent ? 28 : 36,
                            height: IconComponent ? 28 : 36
                        }}>
                            {IconComponent ? (
                                <IconComponent
                                    sx={{
                                        fontSize: 28,
                                        color: disabled ? "text.disabled" : "primary.main",
                                        position: "absolute",
                                    }}
                                />
                            ) : image ? (
                                <img
                                    src={image}
                                    alt={title}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        filter: disabled ? "grayscale(100%) opacity(0.6)" : "none",
                                    }}
                                />
                            ) : null}

                            {/* Sub-icon */}
                            {subIcon && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        bottom: -5,
                                        right: -5,
                                        backgroundColor: "background.paper",
                                        borderRadius: "50%",
                                        border: "2px solid",
                                        borderColor: "background.default",
                                        boxShadow: 1,
                                    }}
                                >
                                    {React.cloneElement(subIcon, {
                                        sx: {
                                            fontSize: 14,
                                            color: disabled ? "text.disabled" : "primary.main",
                                        },
                                    })}
                                </Box>
                            )}
                        </Box>
                    </ListItemIcon>
                )}

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        color={disabled || muted ? "text.disabled" : "text.primary"}
                        sx={{ opacity: !muted ? 1 : 0.7 }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: disabled ? "text.disabled" : "gray",
                                opacity: disabled ? 1 : 0.7,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {counter !== undefined && (
                    <Box
                        sx={{
                            display: "table",
                            border: "1px solid",
                            borderRadius: "4px",
                            borderColor: disabled
                                ? "text.disabled"
                                : alpha(theme.palette.primary.main, 0.5),
                            padding: "4px 12px",
                            margin: "0px 16px",
                            minWidth: "42px",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: disabled ? "text.disabled" : "primary.main",
                                fontSize: "16px",
                                textAlign: "center",
                            }}
                        >
                            {counter}
                        </Typography>
                    </Box>
                )}

                {disabled ? null : expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>

            {/* Show only if not disabled */}
            {!disabled && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {children}
                </Collapse>
            )}
        </Box>
    );
};

export default CollapseField;
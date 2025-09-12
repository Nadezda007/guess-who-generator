import React, { useState } from "react";
import { TextField, InputAdornment, Box, Popover, Typography } from '@mui/material';

import Chrome from '@uiw/react-color-chrome';
import { hsvaToHexa, hexToHsva } from '@uiw/color-convert';

import { useTheme } from "@mui/material";
import { alpha } from "@mui/system";

const ColorPickerField = ({
    label = "Color Picker",
    name = "color",
    value,
    onChange,
    sx = {},
    disabled = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [hsva, setHsva] = useState(hexToHsva(value || "#00000000"));
    const [anchorEl, setAnchorEl] = useState(null);
    const minLength = 2;
    const maxLength = 8;

    const removeHash = (str) => {
        if (!str) return "";
        return str.startsWith('#') ? str.substring(1) : str;
    };

    const addHash = (str) => {
        if (!str) return "";
        return str.startsWith('#') ? str : "#" + str;
    };

    const handleChange = (event) => {
        if (disabled) return; // ← input lock
        if (event.target.value.length <= maxLength && event.target.value.length >= minLength) {
            const newColor = addHash(event.target.value).toUpperCase();
            setHsva(hexToHsva(newColor));
            onChange({ target: { name, value: newColor } });
        }
    };

    const handleOpen = (event) => {
        if (!disabled) setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <TextField
            label={label}
            name={name}
            type="text"
            value={removeHash(value)}
            onChange={handleChange}
            sx={{ ...sx }}
            fullWidth
            disabled={disabled}
            slotProps={{
                htmlInput: {
                    minLength: minLength,
                    maxLength: maxLength,
                },
                input: {
                    startAdornment: (
                        <Box display={"flex"}>
                            <InputAdornment position="start">
                                <Box
                                    sx={{
                                        backgroundColor: disabled
                                            ? isDark ? "#222" : "#eee"
                                            : null,
                                        borderRadius: "4px",
                                    }}>
                                    <Box
                                        aria-describedby={id}
                                        onClick={handleOpen}
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            backgroundColor: disabled ? alpha(value, 0.4) : value,
                                            borderRadius: "4px",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            cursor: disabled ? "not-allowed" : "pointer",
                                            pointerEvents: disabled ? "none" : "auto",
                                        }}
                                    />
                                </Box>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    sx={{
                                        ".MuiPopover-paper": {
                                            borderRadius: "12px",
                                            border: '1px solid',
                                            borderColor: theme.palette.divider,
                                        },
                                    }}
                                >
                                    <Chrome
                                        name={name}
                                        color={hsva}
                                        style={{
                                            backgroundColor: theme.palette.background.paper,
                                            backgroundImage: "none",
                                            border: '0px !important',
                                        }}
                                        placement="null"
                                        onChange={(color) => {
                                            if (disabled) return;
                                            setHsva(color.hsva);
                                            const newColor = hsvaToHexa(color.hsva).toUpperCase();
                                            onChange({ target: { name, value: newColor } });
                                        }}
                                    />
                                </Popover>
                            </InputAdornment>

                            <InputAdornment>
                                <Typography sx={{ color: disabled ? "text.disabled" : "text.secondary" }}>
                                    #
                                </Typography>
                            </InputAdornment>
                        </Box >
                    ),
                },
            }}
        />
    );
};


export default ColorPickerField;

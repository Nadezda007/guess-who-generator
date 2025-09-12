import React, { useState, useEffect } from "react";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useTranslation } from 'react-i18next';

const options = [
    { label: "show_all", value: "all" },
    { label: "show_bg_back", value: "backgrounds" },
    { label: "show_bg_front", value: "foregrounds" },
    { label: "show_uploaded", value: "uploaded" },
];

const BackgroundFilterButton = ({ initialValue = "all", onValueChange, sx = {} }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { t } = useTranslation(); // connect i18next

    const initialLabel = options.find((opt) => opt.value === initialValue)?.label || options[0].label;
    const [selectedValue, setSelectedValue] = useState(initialLabel);

    useEffect(() => {
        const label = options.find((opt) => opt.value === initialValue)?.label || options[0].label;
        setSelectedValue(label);
    }, [initialValue]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (option) => {
        setAnchorEl(null);
        if (option) {
            setSelectedValue(option.label);
            onValueChange(option.value);
        }
    };

    return (
        <Box sx={{ ...sx }}>
            <Button
                variant="outlined"
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
            >
                {t(selectedValue)}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)}>
                {options.map((option) => (
                    <MenuItem key={option.value} onClick={() => handleClose(option)}>
                        {t(option.label)}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default BackgroundFilterButton;

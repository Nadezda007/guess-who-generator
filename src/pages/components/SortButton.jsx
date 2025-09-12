import React, { useState, useEffect } from "react";
import { Box, Menu, MenuItem, Button, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useTranslation } from 'react-i18next';

const options = [
    { label: "sort_by_id", value: "id" },
    { label: "sort_by_name", value: "name" },
    { label: "sort_by_category", value: "category" },
    { label: "sort_none", value: "none" },
];

const SortButton = ({ initialValue = "none", onSortChange, sx = {} }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { t } = useTranslation(); // connect i18next

    const initialLabel = options.find((opt) => opt.value === initialValue)?.label || "...";
    const [selectedSort, setSelectedSort] = useState(initialLabel);

    useEffect(() => {
        const label = options.find((opt) => opt.value === initialValue)?.label || "...";
        setSelectedSort(label);
    }, [initialValue]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (option) => {
        setAnchorEl(null);
        if (option) {
            setSelectedSort(option.label);
            onSortChange(option.value);
        }
    };

    return (
        <Box sx={{ ...sx }}>
            <Button
                variant="outlined"
                size="large"
                onClick={handleClick}
                sx={{ minWidth: "0 !important", paddingX: "12px" }}
                endIcon={<ArrowDropDownIcon />}
            >
                <Typography>
                    {t(selectedSort)}
                </Typography>
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

export default SortButton;

import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import { forwardRef } from "react";

const ScrollableBox = forwardRef(function ScrollableBox({ children, sx = {}, ...props }, ref) {
    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";
    const inactiveScrollbarColor = isDark ? "#333" : "#ddd";
    const scrollbarColor = isDark ? "#444" : "#ccc";
    const activeScrollbarColor = isDark ? "#555" : "#bbb";

    return (
        <Box
            ref={ref}
            sx={{
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
                marginRight: "1px",
                minHeight: 0,

                // ------ scrollbar ------
                "&::-webkit-scrollbar": {
                    width: "7px",
                },
                // ------ track ------
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                    marginY: "1px",
                },
                // ------ thumb ------
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: inactiveScrollbarColor,
                    borderRadius: "16px",
                    transition: "all 0.4s",
                },
                "&:hover::-webkit-scrollbar-thumb": {
                    background: scrollbarColor,
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: activeScrollbarColor,
                },
                // ------ button ------
                "&::-webkit-scrollbar-button": {
                    width: "0px",
                    height: "0px",
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
});

export default ScrollableBox;

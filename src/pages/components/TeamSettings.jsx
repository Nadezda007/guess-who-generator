import React, { useState } from "react";
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { useTheme } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';
import { alpha } from "@mui/system";

import EditTeamsDialog from "../dialogs/EditTeamsDialog";

function TeamSettings({ teams, setTeams }) {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const isDark = theme.palette.mode === "dark";

    const [isExpanded, setIsExpanded] = useState(false);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpen = () => setOpenEditDialog(true);
    const handleClose = () => setOpenEditDialog(false);

    const handleToggle = (teamId, setting) => {
        setTeams((prevTeams) => ({
            ...prevTeams,
            [teamId]: {
                ...prevTeams[teamId],
                [setting]: !prevTeams[teamId][setting]
            }
        }));
    };

    return (
        <Box>
            {/* Compact mode (4 circles + arrow button) */}
            {!isExpanded && (
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                >
                    {Object.entries(teams).map(([id, { color, active }]) => (
                        <Box
                            key={id}
                            sx={{
                                marginLeft: "2px",
                                borderRadius: "50%",
                                backgroundColor: isDark ? "#222" : "#eee",
                            }}>
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    backgroundColor: active
                                        ? alpha(color, 0.8)
                                        : alpha(color, 0.1),
                                }}
                            />
                        </Box>
                    ))}
                    <IconButton
                        size="small"
                        onClick={() => setIsExpanded(true)}
                    >
                        <ExpandLessIcon />
                    </IconButton>
                </Box>
            )
            }

            {/* Expanded mode */}
            {
                isExpanded && (
                    <Box display="flex" flexDirection="column">
                        {Object.entries(teams).map(([id, { name, color, active, markFront, showBacks }]) => (
                            <Box
                                key={id}
                                display="flex"
                                alignItems="center" gap={1}>
                                <Box
                                    display="flex"
                                    onClick={() => handleToggle(id, "active")}
                                    gap={1}
                                    sx={{
                                        flexGrow: 1,
                                        padding: "8px 4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {/* Circle with color */}
                                    <Box
                                        sx={{
                                            borderRadius: "50%",
                                            backgroundColor: isDark ? "#222" : "#eee",
                                        }}>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                backgroundColor: active
                                                    ? alpha(color, 0.8)
                                                    : alpha(color, 0.1),
                                            }}
                                        />
                                    </Box>

                                    {/* Text with color name */}
                                    <Typography
                                        color={active
                                            ? "primary"
                                            : "textDisabled"}>
                                        {t(name)}
                                    </Typography>
                                </Box>

                                {/* Toggle Buttons */}
                                <ToggleButtonGroup
                                    value={active ? [
                                        markFront ? "markFront" : null,
                                        showBacks ? "showBacks" : null
                                    ].filter(Boolean) : []}
                                    aria-label="Print settings"
                                >
                                    <ToggleButton
                                        value="markFront"
                                        onClick={() => handleToggle(id, "markFront")}
                                        disabled={!active}
                                        color="primary"
                                        size="small"
                                        sx={{ paddingY: "4px" }}>
                                        <BookmarkBorderOutlinedIcon />
                                    </ToggleButton>

                                    <ToggleButton
                                        value="showBacks"
                                        onClick={() => handleToggle(id, "showBacks")}
                                        disabled={!active}
                                        color="primary"
                                        size="small"
                                        sx={{ paddingY: "4px" }}>
                                        <WallpaperOutlinedIcon />
                                    </ToggleButton>

                                </ToggleButtonGroup>
                            </Box>
                        ))}

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {/* Edit button */}
                            <IconButton
                                onClick={handleOpen}
                                sx={{ alignSelf: "center" }}>
                                <EditOutlinedIcon />
                            </IconButton>

                            <EditTeamsDialog
                                open={openEditDialog}
                                onClose={handleClose}
                                teams={teams}
                                setTeams={setTeams}
                            />

                            {/* Collapse button */}
                            <IconButton
                                onClick={() => setIsExpanded(false)}
                                sx={{ alignSelf: "center" }}>
                                <ExpandMoreIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )
            }
        </Box >
    );
};

export default TeamSettings;

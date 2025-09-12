import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const PackItemRow = ({ label, count, onDownload, onDelete, sx = {} }) => {
    const isEmpty = count === 0;

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                padding: '6px 12px',
                mb: 1,
                ...sx
            }}
        >
            <Box display="flex" flexDirection="row" gap={1}>
                <Chip
                    label={count}
                    color={isEmpty ? 'default' : 'primary'}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                />

                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {label}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onDownload}
                    disabled={isEmpty}
                    sx={{ minWidth: 0, padding: "4px" }}
                >
                    <FileDownloadOutlinedIcon fontSize="small" />
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={onDelete}
                    disabled={isEmpty}
                    sx={{ minWidth: 0, padding: "4px" }}
                >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                </Button>
            </Box>
        </Box>
    );
};

export default PackItemRow;

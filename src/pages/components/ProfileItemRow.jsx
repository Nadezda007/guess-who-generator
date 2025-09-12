import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ProfileItemRow = ({ text = '00', isFirst, isLast, onMoveUp, onMoveDown, onEdit, onDownload, onDelete }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ marginBlock: "4px" }}>
            <Button
                variant="outlined"
                size="small"
                onClick={onMoveUp}
                disabled={isFirst}
                sx={{
                    minHeight: 0, minWidth: 0,
                    padding: '4px', mr: '4px',
                }}
            >
                <ArrowUpwardOutlinedIcon />
            </Button>

            <Button
                variant="outlined"
                size="small"
                onClick={onMoveDown}
                disabled={isLast}
                sx={{
                    minHeight: 0, minWidth: 0,
                    padding: '4px'
                }}
            >
                <ArrowDownwardOutlinedIcon />
            </Button>

            <Box
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginInline: '12px',
                }}
            >
                {text}
            </Box>

            <Button
                variant="outlined"
                size="small"
                onClick={onEdit}
                sx={{
                    minHeight: 0, minWidth: 0,
                    padding: '4px', mr: '4px',
                }}
            >
                <EditOutlinedIcon />
            </Button>

            <Button
                variant="outlined"
                // color="warning"
                size="small"
                onClick={onDownload}
                sx={{
                    minHeight: 0, minWidth: 0,
                    padding: '4px', mr: '4px',
                }}
            >
                <FileDownloadOutlinedIcon />
            </Button>

            <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onDelete}
                sx={{
                    minHeight: 0, minWidth: 0,
                    padding: '4px',
                }}
            >
                <DeleteOutlineOutlinedIcon />
            </Button>
        </Box>
    );
};

export default ProfileItemRow;

import React, { useMemo } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import findMismatches from "../../utils/findMismatches";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

const ProfileDiffDialog = ({ open, onClose, onConfirm, profile, userData }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const mismatches = useMemo(() => {
        if (!profile || !userData) return [];

        return findMismatches(userData, profile);
    }, [profile, userData]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            scroll="body"
            sx={{
                ".MuiDialog-paper": {
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "20px",
                },
            }}
        >
            <DialogTitle sx={{ paddingBottom: "8px" }}>
                {t('profile_updating')}
            </DialogTitle>

            <DialogContent >
                {mismatches.length === 0 ? (
                    <Typography color="text.secondary">
                        {t('no_differences_found')}
                    </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>{t('field')}</b></TableCell>
                                <TableCell><b>{t('old_value')}</b></TableCell>
                                <TableCell><b>{t('new_value')}</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mismatches.map(({ key, profileValue, userValue }) => (
                                <TableRow key={key}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell sx={{ color: "error.main" }}>
                                        {JSON.stringify(profileValue)}
                                    </TableCell>
                                    <TableCell sx={{ color: "success.main" }}>
                                        {JSON.stringify(userValue)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_cancel')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    disabled={mismatches.length === 0}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileDiffDialog;

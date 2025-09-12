import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

const ConfirmDeleteProfileDialog = ({ open, onClose, onConfirm, name }) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
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
                {t('delete_profile')} "{name}"?
            </DialogTitle>
            <DialogContent>
                {t('delete_profile_warning')}
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
                    onClick={onConfirm}
                    color="error"
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteProfileDialog;

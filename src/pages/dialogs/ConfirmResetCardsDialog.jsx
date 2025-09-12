import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

const ConfirmResetCardsDialog = ({ open, onClose, onConfirm, counter }) => {
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
                {t('reset_changes')} {counter} {counter === 1 ? t('x_card') : t('x_cards')}?
            </DialogTitle>

            <DialogContent>
                {t('reset_cards_warning')}
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
                    {t('button_reset_action')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmResetCardsDialog;

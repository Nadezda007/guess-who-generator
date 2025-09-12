import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { useTheme } from "@mui/material";

function CollapsButton({ label, collapsed, setCollapsed, reverse = false, sx }) {
    const theme = useTheme();

    return (
        <Button
            variant="outlined"
            size="large"
            sx={{
                display: "flex",
                minWidth: 0,
                padding: 1,
                paddingLeft: (!reverse && collapsed && label) ? 2 : 1,
                paddingRight: (reverse && collapsed && label) ? 2 : 1,
                margin: 1,
                gap: 1,
                flexDirection: reverse ? "row-reverse" : "row",
                backgroundColor: theme.palette.background.default,
                ...sx,
            }}
            onClick={() => setCollapsed(!collapsed)}
        >
            {collapsed && label}
            {reverse
                ? (collapsed ? <ArrowBackIcon /> : <ArrowForwardIcon />)
                : (collapsed ? <ArrowForwardIcon /> : <ArrowBackIcon />)
            }
        </Button>
    );
}

export default CollapsButton;

import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { ReportProblem, ExpandMore } from "@mui/icons-material";

const ErrorFallback = ({ error, resetError }) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    backdropFilter: "blur(10px)",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 3,
                    boxShadow: 6,
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <ReportProblem color="error" sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h5" fontWeight="bold" color="error.main">
                            Oops! Something went wrong
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{ mb: 2, fontStyle: "italic", color: "text.secondary" }}
                    >
                        {error?.message || "Unknown error"}
                    </Typography>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="body2">Show technical details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: "monospace",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}
                            >
                                {error?.stack || "No stack trace available"}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ textAlign: "right" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={resetError}
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default function AppErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, stackTrace) => {
                console.error("App crashed:", error, stackTrace);
            }}
        >
            {children}
        </ErrorBoundary>
    );
}

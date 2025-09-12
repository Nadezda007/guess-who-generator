import React, { useState, useMemo, createContext, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export function useThemeToggle() {
    return useContext(ThemeContext);
}

export default function ThemeToggleProvider({ children }) {
    const storedTheme = localStorage.getItem("theme") || "light";
    const [mode, setMode] = useState(storedTheme);

    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

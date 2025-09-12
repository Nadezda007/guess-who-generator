import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { ButtonGroup, Menu, MenuItem } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import GitHubIcon from '@mui/icons-material/GitHub';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { useTranslation } from 'react-i18next';
import { useThemeToggle } from "../theme/ThemeToggleProvider";
import { availableLanguages } from '../i18n/availableLanguages';
import EditCardLanguageDialog from './dialogs/EditCardLanguageDialog';

const Header = ({ settings, userData, setUserData, sx = {} }) => {
  const { mode, toggleTheme } = useThemeToggle();
  const { t, i18n } = useTranslation(); // connect i18next

  const [anchorEl, setAnchorEl] = useState(null);
  const [cardLanguageDialogOpen, setCardLanguageDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language); // change language
    setAnchorEl(null); // close the menu
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ height: "auto", ...sx }} >
      <Toolbar>
        {/* ------- SITE ICON ------- */}
        <DesignServicesIcon
          edge="start"
          color="primary"
          sx={{ mr: 2 }} />

        {/* ------- TITLE ------- */}
        <Typography variant="h6"
          sx={{
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}>
          {t('guess_who_card_generator')}
        </Typography>


        {/* ------- GITHUB ------- */}
        <IconButton
          color="inherit"
          href="https://github.com/r33yl/guess-who-generator"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mr: 1 }}>
          <GitHubIcon />
        </IconButton>

        {/* ------- THEME ------- */}
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ mr: 1 }}>
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

        {/* ------- LANGUAGE ------- */}
        <ButtonGroup>
          <Button
            aria-controls="language-menu"
            variant="outlined"
            color="inherit"
            onClick={handleMenuOpen}
            edge="end">
            {t('language')}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              borderColor: userData.customCardLanguage ? "primary.main" : undefined,
              backgroundColor: userData.customCardLanguage ? "primary.main" : undefined,
              color: userData.customCardLanguage ? "primary.contrastText" : undefined,
            }}
            onClick={() => setCardLanguageDialogOpen(true)}
          >
            <ImageOutlinedIcon fontSize="small" />
          </Button>
        </ButtonGroup>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          {availableLanguages.map(lang => (
            <MenuItem
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}>
              {lang.label}
            </MenuItem>
          ))}
        </Menu>

        <EditCardLanguageDialog
          open={cardLanguageDialogOpen}
          onClose={() => setCardLanguageDialogOpen(false)}
          userData={userData} setUserData={setUserData}
        />

      </Toolbar>

      {/* ------- DIVIDER ------- */}
      <Divider orientation="horisontal" />

    </AppBar>

  );
}

export default Header;

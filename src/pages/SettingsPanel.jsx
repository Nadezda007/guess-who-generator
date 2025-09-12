import React, { useState, useEffect, useCallback } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Button,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  InputAdornment,
  Slider,
  Switch,
  IconButton,
  ButtonGroup,
  Menu
} from "@mui/material";

import CollapseField from "./components/CollapseField";
import ScrollableBox from "./components/ScrollableBox";
import ColorPickerField from "./components/ColorPickerField";
import CardBackgroundSelector from "./components/CardBackgroundSelector";
import DownloadDialog from "./dialogs/DownloadDialog";
import AddSettingsProfileDialog from "./dialogs/AddSettingsProfileDialog";

import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Grid3x3OutlinedIcon from '@mui/icons-material/Grid3x3Outlined';

import CropPortraitOutlinedIcon from '@mui/icons-material/CropPortraitOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VignetteOutlinedIcon from '@mui/icons-material/VignetteOutlined';
import FlipToFrontOutlinedIcon from '@mui/icons-material/FlipToFrontOutlined';
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';

import FormatShapesOutlinedIcon from '@mui/icons-material/FormatShapesOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';

import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

import availableFonts from "../data/availableFonts";
import patternShapes from "../data/patternShapes";
import generateRandomString from "../utils/generateRandomString";
import ProfileManagerDialog from "./dialogs/ProfileManagerDialog";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ProfileDiffDialog from "./dialogs/ProfileDiffDialog";
import { hasProfileChanged } from "../utils/hasProfileChanged";

import { useTranslation } from 'react-i18next';
import initialSettings from "../data/initialSettings";

function SettingsPanel({
  userData, setUserData, isUserDataLoading,
  settings, setSettings,
  defaultSettingsProfiles,
  settingsProfiles, addSettingsProfile,
  updateSettingsProfile, deleteSettingsProfile,
  backgrounds, localBackgrounds,
  addLocalBackground, deleteLocalBackground,
  teams,
  sx = {}
}) {
  const { t } = useTranslation(); // connect i18next

  const [anchorEl, setAnchorEl] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [addProfileDialogOpen, setAddProfileDialogOpen] = useState(false);
  const [diffDialogOpen, setDiffDialogOpen] = useState(false);
  const [profileSettingsDialogOpen, setProfileSettingsDialogOpen] = useState(false);
  const [format, setFormat] = useState("jpg");

  const isJpg = format === "jpg";
  const isPng = format === "png";

  const isCardCssBorder = settings.cardBorderVersion === "css";
  const isBackCardCssBorder = settings.backCardBorderVersion === "css";

  const showMarkFrontSettings = Object.values(teams).some(
    (team) => team.active && team.markFront
  );
  const showShowBacksSettings = Object.values(teams).some(
    (team) => team.active && team.showBacks
  );

  const CardOutlineIcon = (props) => (
    <VignetteOutlinedIcon
      {...props}
      sx={{
        transform: 'rotate(90deg)',
        ...props.sx,
      }} />
  );

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (option) => {
    setAnchorEl(null);
    // if (option) {
    //   setSelectedSort(option.label);
    //   onSortChange(option.value);
    // }
  };

  const useHandleChange = (setState) => {
    return useCallback((event) => {
      const { name, value, type, checked } = event.target;

      setState((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? +value
              : value,
      }));
    }, [setState]);
  };

  const updateSetting = (key, value) => {
    // console.log(key);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateUserData = (key, value) => {
    // console.log(key);
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingsChange = useHandleChange(setSettings);
  const handleUserDataChange = useHandleChange(setUserData);

  const handlePaperFormatChange = (value) => {
    const paperFormats = {
      A3: { width: 297, height: 420 },
      A4: { width: 210, height: 297 },
      A5: { width: 148, height: 210 },
      B4: { width: 250, height: 353 },
      B5: { width: 176, height: 250 },
    };

    setSettings((prev) => ({
      ...prev,
      paperFormat: value,
      paperWidth: paperFormats[value]?.width || prev.paperWidth,
      paperHeight: paperFormats[value]?.height || prev.paperHeight,
    }));
  };

  const handleCardSizeChange = (value) => {
    const cardSizes = {
      small: { width: 20, height: 30 },
      standard: { width: 25, height: 35 },
      big: { width: 30, height: 40 },
    };

    setSettings((prev) => ({
      ...prev,
      cardSize: value,
      cardWidth: cardSizes[value]?.width || prev.cardWidth,
      cardHeight: cardSizes[value]?.height || prev.cardHeight,
    }));
  };

  const handleFormatChange = (_, newFormat) => {
    if (newFormat !== null) {
      setFormat(newFormat);
    }
  };

  const handleToggleBorderTeamColor = useCallback((e) => {
    const { name } = e.currentTarget;

    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, [setSettings]);


  const sortedUserProfiles = Array.from(settingsProfiles.values())
    .sort((a, b) => a.order - b.order);

  const profileList = [
    {
      id: "none",
      isNone: true,
      editable: true,
      ...initialSettings
    },
    ...sortedUserProfiles.map(profile => ({
      ...profile,
      isNone: false, // rename "none"
      editable: true, // rename "custom"
    })),
    ...Array.from(defaultSettingsProfiles.values()).map(profile => ({
      ...profile,
      isNone: false,
      editable: false,
    })),
  ];

  useEffect(() => {
    if (!userData || !userData.activeProfile) return;

    const activeProfile = profileList.find(p => p.id === userData.activeProfile);
    if (activeProfile) {
      setSettings(activeProfile);
    }
  }, [userData.activeProfile]);

  const currentProfile = profileList.find(p => p.id === userData.activeProfile)
    || profileList.find(p => p.id === "none");
  const currentProfileIndex = profileList.indexOf(currentProfile);

  const handleSelectProfile = async (profileId) => {
    const selectedProfile = profileList.find(p => p.id === profileId);
    console.log(selectedProfile);
    if (selectedProfile) {
      // Apply settings
      setSettings(selectedProfile);
      // Update userData
      const newUserData = { ...userData, activeProfile: profileId };
      setUserData(newUserData);
      // Save to indexDB (if you already have one for userData DB)
      // await setActiveProfileId(profileId);
      handleMenuClose();
    }
  };

  const handlePrevProfile = () => {
    if (profileList.length === 0) return;

    const prevIndex = (currentProfileIndex - 1 + profileList.length) % profileList.length;
    const prevProfile = profileList[prevIndex];
    handleSelectProfile(prevProfile.id);
  };

  const handleNextProfile = () => {
    if (profileList.length === 0) return;

    const nextIndex = (currentProfileIndex + 1) % profileList.length;
    const nextProfile = profileList[nextIndex];
    handleSelectProfile(nextProfile.id);
  };

  const [compareProfileStatus, setCompareProfileStatus] = useState(false);

  useEffect(() => {
    if (!currentProfile || !settings) return;

    const isEqual = hasProfileChanged(settings, currentProfile);
    setCompareProfileStatus(isEqual);
  }, [userData.activeProfile, currentProfile, settings]);

  return (
    <Box sx={{
      display: "flex",
      height: "calc(100vh - 64px)",
      flexDirection: "column",
      justifyContent: "space-between",
      // height: "auto",
      // flex: 1,
      ...sx,
    }}>
      {/* ------- PROFILES ROW ------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          padding: "8px 8px 8px 16px",
          gap: 1,
        }}>

        <Typography
          sx={{ fontSize: "18px" }}>
          {t('settings_profiles')}
        </Typography>

        <Box display="flex" gap={1}>

          {/* ------- CREATE / EDIT BUTTON ------- */}
          <Button
            variant="outlined"
            color={currentProfile.isNone
              ? "primary"
              : compareProfileStatus
                ? "success"
                : "primary"}

            // compareProfileStatus

            disabled={currentProfile.isNone
              ? false
              : currentProfile.editable
                ? compareProfileStatus
                  ? false
                  : true
                : true}
            sx={{ minWidth: "0 !important", paddingX: "12px" }}
            onClick={
              currentProfile.isNone
                ? () => setAddProfileDialogOpen(true)
                : currentProfile.editable
                  ? () => setDiffDialogOpen(true)
                  : null
            }
          >
            {currentProfile.isNone
              ? <AddOutlinedIcon sx={{ mr: "4px", ml: "-2px" }} />
              : currentProfile.editable
                ? <SaveOutlinedIcon sx={{ mr: "4px", ml: "-2px" }} />
                : <></>}
            <Typography>
              {currentProfile.isNone
                ? t('button_create')
                : currentProfile.editable
                  ? t('button_save')
                  : t('preset_standard')}
            </Typography>
          </Button>

          <ProfileDiffDialog
            open={diffDialogOpen}
            onClose={() => setDiffDialogOpen(false)}
            profile={currentProfile}
            userData={settings}
            onConfirm={() => updateSettingsProfile(currentProfile.id, settings)}
          />

          <AddSettingsProfileDialog
            open={addProfileDialogOpen}
            onClose={() => setAddProfileDialogOpen(false)}
            settings={settings}
            profileList={profileList}
            addSettingsProfile={addSettingsProfile}
            selectProfile={handleSelectProfile}
          />

          {/* ------- PREV / MENU / NEXT------- */}
          <ButtonGroup
            variant="outlined"
          >
            <Button
              variant="outlined"
              sx={{ minWidth: "0 !important", padding: "4px" }}
              onClick={handlePrevProfile}
            >
              <ArrowBackIosNewOutlinedIcon fontSize="small" />
            </Button>

            <Button
              aria-controls="preset-menu"
              variant="outlined"
              sx={{
                minWidth: "120px !important",
                maxWidth: "130px !important",
                padding: "4px 8px",
              }}

              onClick={handleMenuClick}
              edge="end"
            >
              <Typography>
                {isUserDataLoading ? "..." : (currentProfile.name || currentProfile.id)}
              </Typography>
            </Button>

            <Menu
              id="preset-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >

              <MenuItem
                key="none"
                value="none"
                onClick={() => handleSelectProfile("none")}>
                {"New"}
              </MenuItem>

              {settingsProfiles.size > 0 && <Divider sx={{ marginBlock: "4px !important" }} />}

              {Array.from(settingsProfiles.values()).map((profile) => (

                <MenuItem
                  key={profile.id}
                  value={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                >
                  {profile.name || profile.id}
                </MenuItem>
              ))}

              {defaultSettingsProfiles.size > 0 && <Divider sx={{ marginBlock: "4px !important" }} />}

              {Array.from(defaultSettingsProfiles.values()).map((profile) => (
                <MenuItem
                  key={profile.id}
                  value={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                >
                  {profile.name || profile.id}
                </MenuItem>
              ))}

            </Menu>

            <Button
              variant="outlined"
              sx={{ minWidth: "0 !important", padding: "4px" }}
              onClick={handleNextProfile}
            >
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            </Button>

          </ButtonGroup>


          <IconButton
            onClick={() => setProfileSettingsDialogOpen(true)}
          >
            <SettingsIcon />
          </IconButton>

          <ProfileManagerDialog
            open={profileSettingsDialogOpen}
            onClose={() => setProfileSettingsDialogOpen(false)}
            settings={settings}
            allProfileList={profileList}
            profileList={
              profileList.filter(p => p.isNone === false && p.editable === true)
            }
            addSettingsProfile={addSettingsProfile}
            updateSettingsProfile={updateSettingsProfile}
            deleteSettingsProfile={deleteSettingsProfile}
          />
        </Box>
      </Box>

      <ScrollableBox>
        <Box>
          <Typography
            sx={{
              padding: "8px 16px 2px 16px",
              color: "text.secondary"
            }}>
            {t('paper_settings')}
          </Typography>

          {/* ------- PAPER FORMAT BOX------- */}
          <CollapseField
            title={t('paper')}
            icon={InsertDriveFileOutlinedIcon} >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>
              {/* ------- PAPER FORMAT ------- */}
              <FormControl fullWidth sx={{ mt: "12px" }}>
                <InputLabel>{t('paper_format')}</InputLabel>
                <Select
                  label={t('paper_format')}
                  name="paperFormat"
                  value={settings.paperFormat}
                  onChange={(e) => handlePaperFormatChange(e.target.value)}
                >
                  <MenuItem value="A3">A3 (297x420 {t('unit_mm')})</MenuItem>
                  <MenuItem value="A4">A4 (210x297 {t('unit_mm')})</MenuItem>
                  <MenuItem value="A5">A5 (148x210 {t('unit_mm')})</MenuItem>
                  <MenuItem value="B4">B4 (250x353 {t('unit_mm')})</MenuItem>
                  <MenuItem value="B5">B5 (176x250 {t('unit_mm')})</MenuItem>
                  <MenuItem value="custom">{t('set_manually')}</MenuItem>
                </Select>
              </FormControl>

              {/* ------- CUSTOM PAPER SIZE ------- */}
              {
                settings.paperFormat === "custom" && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    {/* ------- CUSTOM WIDTH ------- */}
                    <TextField
                      label={t('width')}
                      name="paperWidth"
                      type="number"
                      value={settings.paperWidth}
                      onChange={handleSettingsChange}
                      fullWidth
                      sx={{ marginRight: "8px" }}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">{t('unit_mm')}</InputAdornment>,
                        },
                      }}
                    />
                    {/* ------- CUSTOM HEIGHT ------- */}
                    <TextField
                      label={t('height')}
                      name="paperHeight"
                      type="number"
                      value={settings.paperHeight}
                      onChange={handleSettingsChange}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">{t('unit_mm')}</InputAdornment>,
                        },
                      }}
                    />
                  </Box>
                )
              }

              {/* ------- PAPER ORIENTATION ------- */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" sx={{ mb: "4px" }}>
                  {t('orientation')}
                </Typography>

                <ToggleButtonGroup
                  name="orientation"
                  value={settings.orientation}
                  onChange={(e) => updateSetting("orientation", e.target.value)}
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="portrait" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('portrait')}
                  </ToggleButton>
                  <ToggleButton value="landscape" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('landscape')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>


              {/* ------- PAPER PADDING ------- */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('edge_offset_label')} {settings.paperPadding} {t('unit_mm')}
                </Typography>
                <Slider
                  name="paperPadding"
                  value={settings.paperPadding}
                  min={1}
                  max={15}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} ${t('unit_mm')}`}
                />
              </Box>
            </Box>
            <Divider />
          </CollapseField>

          {/* ------- GRID BOX------- */}
          <CollapseField
            title={t('grid')}
            icon={Grid3x3OutlinedIcon} >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>
              {/* ------- GRIG COLOR ------- */}
              <ColorPickerField
                label={t('grid_color')}
                name="gridColor"
                value={settings.gridColor}
                onChange={handleSettingsChange}
                sx={{ mt: "12px" }}
              />

              {/* ------- GRIG SIZE ------- */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>{t('grid_width')} {settings.gridWidth}{t('unit_px')}</Typography>
                <Slider
                  name="gridWidth"
                  value={settings.gridWidth}
                  min={0}
                  max={4}
                  step={0.5}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>
            </Box>
            <Divider />
          </CollapseField>

          <Divider />

          <Typography
            sx={{
              padding: "8px 16px 2px 16px",
              color: "text.secondary"
            }}>
            {t('cards_settings')}
          </Typography>

          {/* ------- CARD SIZE BOX ------- */}
          <CollapseField
            title={t('cards')}
            icon={CropPortraitOutlinedIcon}
          // defaultExpanded={true}
          >
            <Box sx={{ paddingX: "16px", mb: "12px" }}>
              {/* ------- CARD SIZE ------- */}
              <FormControl fullWidth sx={{ mt: "12px" }}>
                <InputLabel>{t('cards_size')}</InputLabel>
                <Select
                  label={t('cards_size')}
                  name="cardSize"
                  value={settings.cardSize}
                  onChange={(e) => handleCardSizeChange(e.target.value)}
                >
                  <MenuItem value="small">{t('size_small')} (20x30 {t('unit_mm')})</MenuItem>
                  <MenuItem value="standard">{t('size_standard')} (24x34 {t('unit_mm')})</MenuItem>
                  <MenuItem value="big">{t('size_large')} (30x40 {t('unit_mm')})</MenuItem>
                  <MenuItem value="custom">{t('set_manually')}</MenuItem>
                </Select>
              </FormControl>

              {/* ------- CUSTOM CARD SIZE ------- */}
              {
                settings.cardSize === "custom" && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    {/* ------- CUSTOM WIDTH ------- */}
                    <TextField
                      label={t('width')}
                      name="cardWidth"
                      type="number"
                      value={parseInt(`${settings.cardWidth}`, 10)}
                      onChange={handleSettingsChange}
                      fullWidth
                      sx={{ marginRight: "8px" }}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">{t('unit_mm')}</InputAdornment>,
                        },
                      }}
                    />
                    {/* ------- CUSTOM HEIGHT ------- */}
                    <TextField
                      label={t('height')}
                      name="cardHeight"
                      type="number"
                      // value={settings.cardHeight}
                      value={parseInt(`${settings.cardHeight}`, 10)}
                      onChange={handleSettingsChange}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">{t('unit_mm')}</InputAdornment>,
                        },
                      }}
                    />
                  </Box>
                )
              }

              {/* ------- CARD BACKGROUND COLOR ------- */}
              <ColorPickerField
                label={t('cards_bg_color')}
                name="cardBackgroundColor"
                value={settings.cardBackgroundColor}
                onChange={handleSettingsChange}
                sx={{ mt: 2 }}
              />

            </Box>
            <Divider />
          </CollapseField>

          {/* ------- CARD SIZE BOX ------- */}
          <CollapseField
            title={t('image')}
            icon={ImageOutlinedIcon}
          >

            {/* ------- JPG/PNG SETTINGS ------- */}
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <FormControlLabel
                label={t('on_top')}
                name="imageOverEverything"
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name="imageOverEverything"
                    checked={settings.imageOverEverything}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <Box display="flex" sx={{ mt: 1, alignItems: "center", justifyContent: "space-between" }}>
                {/* ------- JPG/PNG TITLE ------- */}
                <Typography variant="body1" >
                  {t('settings_for_label')} {format.toUpperCase()}
                </Typography>

                {/* ------- JPG/PNG  ------- */}
                <ToggleButtonGroup
                  value={format}
                  onChange={handleFormatChange}
                  exclusive
                >
                  <ToggleButton value="jpg" sx={{ padding: "4px 8px 2px 8px" }}>
                    jpg
                  </ToggleButton>
                  <ToggleButton value="png" sx={{ padding: "4px 8px 2px 8px" }}>
                    png
                  </ToggleButton>
                  <ToggleButton value="other" sx={{ padding: "4px 8px 2px 8px" }}>
                    other
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* ------- CARD IMAGE FIT  ------- */}
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>{t('image_insert_mode')}</InputLabel>
                <Select
                  label={t('image_insert_mode')}
                  name={isJpg ? "imageFitJpg" : (isPng ? "imageFitPng" : "imageFit")}
                  value={isJpg ? settings.imageFitJpg : (isPng ? settings.imageFitPng : settings.imageFit)}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="contain">Contain</MenuItem>
                  <MenuItem value="cover">Cover</MenuItem>
                  <MenuItem value="fill">Fill</MenuItem>
                </Select>
              </FormControl>

              {/* ------- CARD IMAGE PADDING  ------- */}

              <Box sx={{ mt: 1 }}>
                {/* Horizontal indent */}
                <Typography variant="body1" gutterBottom>
                  {t('offset_x')} {isJpg ? settings.imagePaddingXJpg : (isPng ? settings.imagePaddingXPng : settings.imagePaddingX)}{t('unit_px')}
                </Typography>
                <Slider
                  name={isJpg ? "imagePaddingXJpg" : (isPng ? "imagePaddingXPng" : "imagePaddingX")}
                  value={isJpg ? settings.imagePaddingXJpg : (isPng ? settings.imagePaddingXPng : settings.imagePaddingX)}
                  min={0}
                  max={32}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              {/* Vertical indents */}
              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('offset_top')} {isJpg ? settings.imagePaddingTopJpg : (isPng ? settings.imagePaddingTopPng : settings.imagePaddingTop)}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isJpg ? "imagePaddingTopJpg" : (isPng ? "imagePaddingTopPng" : "imagePaddingTop")}
                    value={isJpg ? settings.imagePaddingTopJpg : (isPng ? settings.imagePaddingTopPng : settings.imagePaddingTop)}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('offset_bottom')} {isJpg ? settings.imagePaddingBottomJpg : (isPng ? settings.imagePaddingBottomPng : settings.imagePaddingBottom)}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isJpg ? "imagePaddingBottomJpg" : (isPng ? "imagePaddingBottomPng" : "imagePaddingBottom")}
                    value={isJpg ? settings.imagePaddingBottomJpg : (isPng ? settings.imagePaddingBottomPng : settings.imagePaddingBottom)}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

            </Box>
            <Divider />
          </CollapseField>


          <CollapseField
            title={t('patterned_background')}
            icon={TextureOutlinedIcon}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "12px" }}>
                <ColorPickerField
                  label={t('background_color')}
                  name="patternBackgroundColor"
                  value={settings.patternBackgroundColor}
                  onChange={handleSettingsChange}
                  disabled={settings.patternBackgroundUseTeamColor}
                />

                <Button
                  variant={settings.patternBackgroundUseTeamColor ? "contained" : "outlined"}
                  name={"patternBackgroundUseTeamColor"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  label={t('seed')}
                  name="patternSeed"
                  value={settings.patternSeed}
                  onChange={(e) => updateSetting("patternSeed", e.target.value)}
                  disabled={settings.uniquePatternSeed}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" size="small"
                            onClick={() => updateSetting("patternSeed", generateRandomString())}
                            disabled={settings.uniquePatternSeed}
                          >
                            <AutorenewOutlinedIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />
                <Button
                  variant={settings.uniquePatternSeed ? "contained" : "outlined"}
                  name={"uniquePatternSeed"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                    mt: 2,
                  }}>
                  {t('unique_seeds')}
                </Button>
              </Box>


              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <ColorPickerField
                  label={t('objects_color')}
                  name={"patternColor"}
                  value={settings.patternColor}
                  onChange={handleSettingsChange}
                  disabled={settings.patternUseTeamColor}
                />
                <Button
                  variant={settings.patternUseTeamColor ? "contained" : "outlined"}
                  name={"patternUseTeamColor"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('objects_count')} {settings.patternShapesCount}{t('unit_pcs')}
                </Typography>
                <Slider
                  name={"patternShapesCount"}
                  value={settings.patternShapesCount}
                  min={0}
                  max={100}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_pcs')}`}
                />
              </Box>

              <Typography variant="body1" sx={{ mt: 0, mb: "4px" }}>
                {t('shape_types')}
              </Typography>
              <ToggleButtonGroup
                value={settings.patternSelectedShapes}
                onChange={(_, newShapes) => updateSetting("patternSelectedShapes", newShapes)}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {patternShapes.map((shape) => (
                    <ToggleButton key={shape} value={shape} color="primary" size="small">
                      {shape}
                    </ToggleButton>
                  ))}
                </Box>
              </ToggleButtonGroup>


              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_size')} {settings.patternMinSize}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"patternMinSize"}
                    value={settings.patternMinSize}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_size')} {settings.patternMaxSize}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"patternMaxSize"}
                    value={settings.patternMaxSize}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_opacity')} {Math.round(settings.patternMinOpacity * 100)}%
                  </Typography>
                  <Slider
                    name={"patternMinOpacity"}
                    value={settings.patternMinOpacity}
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_opacity')} {Math.round(settings.patternMaxOpacity * 100)}%
                  </Typography>
                  <Slider
                    name={"patternMaxOpacity"}
                    value={settings.patternMaxOpacity}
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_rotation')} {settings.patternMinRotate}°
                  </Typography>
                  <Slider
                    name={"patternMinRotate"}
                    value={settings.patternMinRotate}
                    min={-180}
                    max={0}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_rotation')} {settings.patternMaxRotate}°
                  </Typography>
                  <Slider
                    name={"patternMaxRotate"}
                    value={settings.patternMaxRotate}
                    min={0}
                    max={180}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('dead_zone')} {settings.patternDeadZone}
                </Typography>
                <Slider
                  name={"patternDeadZone"}
                  value={settings.patternDeadZone}
                  min={0}
                  max={2}
                  step={0.1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value}
                />
              </Box>

            </Box>
            <Divider />
          </CollapseField>


          {/* ------- CARD BACKGROUND ------- */}
          <CollapseField
            title={t('background')}
            icon={FlipToFrontOutlinedIcon}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <CardBackgroundSelector
                label={t('cards_background')}
                dialogLabel={t('select_background')}
                backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                addLocalBackground={addLocalBackground} deleteLocalBackground={deleteLocalBackground}
                name="cardBackground"
                value={settings.cardBackground}
                onChange={handleSettingsChange}
                userData={userData}
                sx={{ mt: "12px" }}
              />

              <FormControlLabel
                label={t('overlay_on_image')}
                name="cardBackgroundOverImage"
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name="cardBackgroundOverImage"
                    checked={settings.cardBackgroundOverImage}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{t('image_insert_mode')}</InputLabel>
                <Select
                  label={t('image_insert_mode')}
                  name={"cardBackgroundFit"}
                  value={settings.cardBackgroundFit}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="contain">Contain</MenuItem>
                  <MenuItem value="cover">Cover</MenuItem>
                  <MenuItem value="fill">Fill</MenuItem>
                </Select>
              </FormControl>


              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {t('opacity')} {Math.round(settings.cardBackgroundOpacity * 100)}%
                  </Typography>
                  <Slider
                    name="cardBackgroundOpacity"
                    value={settings.cardBackgroundOpacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>

                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {t('blur')} {settings.cardBackgroundBlur}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="cardBackgroundBlur"
                    value={settings.cardBackgroundBlur}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />

                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('brightness')} {settings.cardBackgroundBrightness}
                  </Typography>
                  <Slider
                    name={"cardBackgroundBrightness"}
                    value={settings.cardBackgroundBrightness}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('saturation')} {settings.cardBackgroundSaturate}
                  </Typography>
                  <Slider
                    name={"cardBackgroundSaturate"}
                    value={settings.cardBackgroundSaturate}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('contrast')} {settings.cardBackgroundContrast}
                  </Typography>
                  <Slider
                    name={"cardBackgroundContrast"}
                    value={settings.cardBackgroundContrast}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('hue')} {settings.cardBackgroundHueRotate}°
                  </Typography>
                  <Slider
                    name={"cardBackgroundHueRotate"}
                    value={settings.cardBackgroundHueRotate}
                    min={-180}
                    max={180}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>
              </Box>

            </Box>
            <Divider />
          </CollapseField>

          <CollapseField
            title={t('stroke')}
            icon={CardOutlineIcon}
            muted={!settings.showCardBorder}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <FormControlLabel
                label={t('show_stroke')}
                name={"showCardBorder"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={"showCardBorder"}
                    checked={settings.showCardBorder}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <FormControlLabel
                label={t('trim_to_border')}
                name={"cardBorderClipContent"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={"cardBorderClipContent"}
                    checked={settings.cardBorderClipContent}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('stroke_variant')}
              </Typography>

              <ToggleButtonGroup
                name="cardBorderVersion"
                value={settings.cardBorderVersion}
                onChange={(e) => updateSetting("cardBorderVersion", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="css" sx={{ padding: "6px 12px 4px 12px" }}>
                  CSS
                </ToggleButton>
                <ToggleButton value="svg" sx={{ padding: "6px 12px 4px 12px" }}>
                  SVG
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                label={t('overlay_on_image')}
                name={isCardCssBorder ? "cardBorderOverImageCss" : "cardBorderOverImageSvg"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={isCardCssBorder ? "cardBorderOverImageCss" : "cardBorderOverImageSvg"}
                    checked={isCardCssBorder ? settings.cardBorderOverImageCss : settings.cardBorderOverImageSvg}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <ColorPickerField
                  label={t('stroke_color')}
                  name={isCardCssBorder ? "cardBorderColorCss" : "cardBorderColorSvg"}
                  value={isCardCssBorder ? settings.cardBorderColorCss : settings.cardBorderColorSvg}
                  onChange={handleSettingsChange}
                  disabled={isCardCssBorder ? settings.cardBorderUseTeamColorCss : settings.cardBorderUseTeamColorSvg}
                />
                <Button
                  variant={isCardCssBorder
                    ? settings.cardBorderUseTeamColorCss ? "contained" : "outlined"
                    : settings.cardBorderUseTeamColorSvg ? "contained" : "outlined"}
                  name={isCardCssBorder ? "cardBorderUseTeamColorCss" : "cardBorderUseTeamColorSvg"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              {isCardCssBorder && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>{t('stroke_style')}</InputLabel>
                  <Select
                    label={t('stroke_style')}
                    name={"cardBorderStyleCss"}
                    value={settings.cardBorderStyleCss}
                    onChange={handleSettingsChange}
                  >
                    <MenuItem value="solid">Solid</MenuItem>
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="groove">Groove</MenuItem>
                    <MenuItem value="ridge">Ridge</MenuItem>
                    <MenuItem value="inset">Inset</MenuItem>
                    <MenuItem value="outset">Outset</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('stroke_width_x')} {isCardCssBorder ? settings.cardBorderWidthXCss : settings.cardBorderWidthXSvg}{t('unit_px')}
                </Typography>
                <Slider
                  name={isCardCssBorder ? "cardBorderWidthXCss" : "cardBorderWidthXSvg"}
                  value={isCardCssBorder ? settings.cardBorderWidthXCss : settings.cardBorderWidthXSvg}
                  min={0}
                  max={32}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width_top')} {isCardCssBorder ? settings.cardBorderWidthTopCss : settings.cardBorderWidthTopSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isCardCssBorder ? "cardBorderWidthTopCss" : "cardBorderWidthTopSvg"}
                    value={isCardCssBorder ? settings.cardBorderWidthTopCss : settings.cardBorderWidthTopSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width_bottom')} {isCardCssBorder ? settings.cardBorderWidthBottomCss : settings.cardBorderWidthBottomSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isCardCssBorder ? "cardBorderWidthBottomCss" : "cardBorderWidthBottomSvg"}
                    value={isCardCssBorder ? settings.cardBorderWidthBottomCss : settings.cardBorderWidthBottomSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1, }}>
                <Typography gutterBottom>
                  {isCardCssBorder ? t('radius') : t('outer_radius')}  {isCardCssBorder ? settings.cardBorderOuterRadiusCss : settings.cardBorderOuterRadiusSvg}{t('unit_px')}
                </Typography>
                <Slider
                  name={isCardCssBorder ? "cardBorderOuterRadiusCss" : "cardBorderOuterRadiusSvg"}
                  value={isCardCssBorder ? settings.cardBorderOuterRadiusCss : settings.cardBorderOuterRadiusSvg}
                  min={0}
                  max={48}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              {!isCardCssBorder && (
                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {t('inner_radius')} {settings.cardBorderInnerRadiusSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"cardBorderInnerRadiusSvg"}
                    value={settings.cardBorderInnerRadiusSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              )}

            </Box>
            <Divider />
          </CollapseField>

          {/* ------- MARK BOX------- */}
          <CollapseField
            title={t('mark_settings')}
            icon={BookmarkBorderOutlinedIcon}
            disabled={!showMarkFrontSettings}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              {/* ------- INTERACTION------- */}
              <FormControl fullWidth sx={{ mt: "12px" }}>
                <InputLabel>{t('style')}</InputLabel>
                <Select
                  label={t('style')}
                  name="markerStyle"
                  value={settings.markerStyle}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="triangle">{t('triangle')}</MenuItem>
                  <MenuItem value="circle">{t('circle')}</MenuItem>
                  <MenuItem value="line">{t('line')}</MenuItem>
                </Select>
              </FormControl>

              {/* ------- INTERACTION------- */}
              <FormControl fullWidth sx={{ mt: "12px" }}>
                <InputLabel>{t('position')}</InputLabel>
                <Select
                  label={t('position')}
                  name="markerPosition"
                  value={settings.markerPosition}
                  onChange={handleSettingsChange}
                >
                  {settings.markerStyle !== "line"
                    ? ([
                      <MenuItem key="top-left" value="top-left">{t('top_left')}</MenuItem>,
                      <MenuItem key="right-top" value="right-top">{t('top_right')}</MenuItem>,
                      <MenuItem key="left-bottom" value="left-bottom">{t('bottom_left')}</MenuItem>,
                      <MenuItem key="bottom-right" value="bottom-right">{t('bottom_right')}</MenuItem>,
                    ]) : ([
                      <MenuItem key="top-left" value="top-left">{t('top')}</MenuItem>,
                      <MenuItem key="right-top" value="right-top">{t('right')}</MenuItem>,
                      <MenuItem key="left-bottom" value="left-bottom">{t('left')}</MenuItem>,
                      <MenuItem key="bottom-right" value="bottom-right">{t('bottom')}</MenuItem>,
                    ])}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <ColorPickerField
                  label={t('mark_color')}
                  name={"markerColor"}
                  value={settings.markerColor}
                  onChange={handleSettingsChange}
                  disabled={settings.markerColorUseTeamColor}
                />
                <Button
                  variant={settings.markerColorUseTeamColor ? "contained" : "outlined"}
                  name={"markerColorUseTeamColor"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              {/* ------- MARKER SIZE ------- */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>{t('size')} {settings.markerSize}{t('unit_px')}</Typography>
                <Slider
                  name="markerSize"
                  value={settings.markerSize}
                  min={2}
                  max={50}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              {/* ------- MARKER SIZE ------- */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>{t('offset')} {settings.markerPadding}{t('unit_px')}</Typography>
                <Slider
                  name="markerPadding"
                  value={settings.markerPadding}
                  min={0}
                  max={32}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              {/* ------- MARKER OPACITY ------- */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>{t('opacity')} {Math.round(settings.markerOpacity * 100)}%</Typography>
                <Slider
                  name="markerOpacity"
                  value={settings.markerOpacity}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
              </Box>

            </Box>
            <Divider />
          </CollapseField>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px 2px 16px",
              color: "text.secondary"
            }}>
            <Typography>
              {t('text_settings')}
            </Typography>

            <Switch
              name="showText"
              checked={settings.showText}
              onChange={handleSettingsChange}
            />
          </Box>

          {/* ------- TEXT BOX------- */}
          <CollapseField
            title={t('text_block')}
            icon={FormatShapesOutlinedIcon}
            disabled={!settings.showText}
          >
            <Box sx={{ mb: "4px" }}>
              {/* ------- TEXT SETTINGS------- */}


              {/* ------- TEXT SETTINGS 1------- */}
              <Box sx={{ paddingX: "16px", mb: "8px" }}>
                {/* ------- TEXT LOCATION------- */}
                <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                  {t('text_position')}
                </Typography>

                <ToggleButtonGroup
                  name="textPosition"
                  value={settings.textPosition}
                  onChange={(e) => updateSetting("textPosition", e.target.value)}
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="down" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('text_position_bottom')}
                  </ToggleButton>
                  <ToggleButton value="up" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('text_position_top')}
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* ------- TEXT OVERLAY------- */}
                <Box display="flex" sx={{ mt: 1 }}>

                  <FormControlLabel
                    label={t('overlay_on_image')}
                    name="textOverlay"
                    sx={{ width: "100%" }}
                    control={
                      <Switch
                        name="textOverlay"
                        checked={settings.textOverlay}
                        onChange={handleSettingsChange}
                      />
                    }
                  />

                  <FormControlLabel
                    label={t('cut_stroke_svg')}
                    name="cutTextFromBorderSvg"
                    disabled={settings.cardBorderVersion !== "svg"}
                    sx={{ width: "100%", marginRight: 0 }}
                    control={
                      <Switch
                        name="cutTextFromBorderSvg"
                        checked={settings.cutTextFromBorderSvg}
                        onChange={handleSettingsChange}
                      />
                    }
                  />
                </Box>
              </Box>

              <Divider />

              {/* ------- TEXT SETTINGS 2 ------- */}
              <Box sx={{ paddingX: "16px", mb: "4px" }}>
                {/* ------- TEXT BACKGROUND COLOR------- */}
                <ColorPickerField
                  label={t('background_color')}
                  name="textBackgroundColor"
                  value={settings.textBackgroundColor}
                  onChange={handleSettingsChange}
                  sx={{ mt: 2 }}
                />

                {/* ------- TEXT PADDING X------- */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_height')} {settings.textBoxMinHeight}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="textBoxMinHeight"
                    value={settings.textBoxMinHeight}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                {/* ------- TEXT PADDING X------- */}
                <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_x')} {settings.textBoxPaddingX}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="textBoxPaddingX"
                      value={settings.textBoxPaddingX}
                      min={0}
                      max={16}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>

                  {/* ------- TEXT PADDING Y------- */}
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_y')} {settings.textBoxPaddingY}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="textBoxPaddingY"
                      value={settings.textBoxPaddingY}
                      min={0}
                      max={16}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 0 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('radius')} {settings.textBoxBorderRadius}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="textBoxBorderRadius"
                    value={settings.textBoxBorderRadius}
                    min={0}
                    max={32}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

              </Box>
            </Box>

            <Divider />
          </CollapseField>


          <CollapseField
            title={t('text')}
            icon={TextFieldsOutlinedIcon}
            disabled={!settings.showText}
          >

            {/* ------- TEXT SETTINGS 3 ------- */}
            <Box sx={{ paddingX: "16px", mb: "12px" }}>
              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('text_alignment')}
              </Typography>

              <ToggleButtonGroup
                name="textAlign"
                value={settings.textAlign}
                onChange={(e) => updateSetting("textAlign", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="left" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_left')}
                </ToggleButton>
                <ToggleButton value="center" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_center')}
                </ToggleButton>
                <ToggleButton value="right" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_right')}
                </ToggleButton>
              </ToggleButtonGroup>

              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('offset_x')} {settings.textPaddingX}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="textPaddingX"
                    value={settings.textPaddingX}
                    min={0}
                    max={16}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                {/* ------- TEXT PADDING Y------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('offset_y')} {settings.textPaddingY}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="textPaddingY"
                    value={settings.textPaddingY}
                    min={0}
                    max={16}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('rotation')} {settings.textBoxRotate}°
                </Typography>
                <Slider
                  name="textBoxRotate"
                  value={settings.textBoxRotate}
                  min={-180}
                  max={180}
                  step={2}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}°`}
                />
              </Box>

              <Box display="flex" sx={{ mt: 0 }}>
                <FormControlLabel
                  label={t('single_line')}
                  name="textSingleLine"
                  sx={{ width: "100%" }}
                  control={
                    <Switch
                      name="textSingleLine"
                      checked={settings.textSingleLine}
                      onChange={handleSettingsChange}
                    />
                  }
                />
                <FormControlLabel
                  label={t('ellipsis_trimming')}
                  name="textEllipsis"
                  sx={{ width: "100%", marginRight: 0 }}
                  control={
                    <Switch
                      name="textEllipsis"
                      checked={settings.textEllipsis}
                      onChange={handleSettingsChange}
                    />
                  }
                />
              </Box>

              {/* ------- TEXT FONT------- */}
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>{t('font')}</InputLabel>
                <Select
                  label={t('font')}
                  name="fontFamily"
                  value={settings.fontFamily}
                  onChange={handleSettingsChange}

                >
                  {availableFonts.map((font) => (
                    <MenuItem
                      key={font}
                      value={font}
                      sx={{ fontFamily: `${font}, sans-serif` }}
                    >
                      {font}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>

              {/* ------- TEXT FONT------- */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{t('font_style')}</InputLabel>
                <Select
                  label={t('font_style')}
                  name="fontStyle"
                  value={settings.fontStyle}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="italic">Italic</MenuItem>
                  <MenuItem value="oblique">Oblique</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('text_case')}
              </Typography>

              <ToggleButtonGroup
                name="textCase"
                value={settings.textCase}
                onChange={(e) => updateSetting("textCase", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="lowercase" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_lowercase')}
                </ToggleButton>
                <ToggleButton value="none" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_original')}
                </ToggleButton>
                <ToggleButton value="uppercase" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_uppercase')}
                </ToggleButton>
              </ToggleButtonGroup>

            </Box>

            <Divider />

            <Box sx={{ paddingX: "16px", mb: "4px" }}>
              <Box display="flex" sx={{ mt: 1, alignItems: "center", justifyContent: "space-between" }}>
                {/* ------- JPG/PNG TITLE ------- */}
                <Typography variant="body1" >
                  {t('settings_for_label')} {format.toUpperCase()}
                </Typography>

                {/* ------- JPG/PNG  ------- */}
                <ToggleButtonGroup
                  value={format}
                  onChange={handleFormatChange}
                  exclusive
                >
                  <ToggleButton value="jpg" sx={{ padding: "4px 8px 2px 8px" }}>
                    jpg
                  </ToggleButton>
                  <ToggleButton value="png" sx={{ padding: "4px 8px 2px 8px" }}>
                    png
                  </ToggleButton>
                  <ToggleButton value="other" sx={{ padding: "4px 8px 2px 8px" }}>
                    other
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* ------- TEXT COLOR------- */}
              <ColorPickerField
                label={t('text_color')}
                name={isJpg ? "textColorJpg" : (isPng ? "textColorPng" : "textColor")}
                value={isJpg ? settings.textColorJpg : (isPng ? settings.textColorPng : settings.textColor)}
                onChange={handleSettingsChange}
                sx={{ mt: 1 }}
              />

              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('font_size')} {isJpg ? settings.fontSizeJpg : (isPng ? settings.fontSizePng : settings.fontSize)}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isJpg ? "fontSizeJpg" : (isPng ? "fontSizePng" : "fontSize")}
                    value={isJpg ? settings.fontSizeJpg : (isPng ? settings.fontSizePng : settings.fontSize)}
                    min={1}
                    max={40}
                    step={0.5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('font_weight')} {isJpg ? settings.fontWeightJpg : (isPng ? settings.fontWeightPng : settings.fontWeight)}
                  </Typography>
                  <Slider
                    name={isJpg ? "fontWeightJpg" : (isPng ? "fontWeightPng" : "fontWeight")}
                    value={isJpg ? settings.fontWeightJpg : (isPng ? settings.fontWeightPng : settings.fontWeight)}
                    min={100}
                    max={900}
                    step={100}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}`}
                  />
                </Box>
              </Box>

              {/* ------- TEXT LETTER SPACING------- */}
              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('letter_spacing')} {isJpg ? settings.letterSpacingJpg : (isPng ? settings.letterSpacingPng : settings.letterSpacing)}{t('unit_px')}
                </Typography>
                <Slider
                  name={isJpg ? "letterSpacingJpg" : (isPng ? "letterSpacingPng" : "letterSpacing")}
                  value={isJpg ? settings.letterSpacingJpg : (isPng ? settings.letterSpacingPng : settings.letterSpacing)}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('line_height')} {isJpg ? settings.textLineHeightJpg : (isPng ? settings.textLineHeightPng : settings.textLineHeight)}
                </Typography>
                <Slider
                  name={isJpg ? "textLineHeightJpg" : (isPng ? "textLineHeightPng" : "textLineHeight")}
                  value={isJpg ? settings.textLineHeightJpg : (isPng ? settings.textLineHeightPng : settings.textLineHeight)}
                  min={0.8}
                  max={2}
                  step={0.1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}`}
                />
              </Box>
            </Box>

            <Divider sx={{ marginX: 2 }} />

            {/* ------- TEXT SETTINGS 3 ------- */}
            <Box sx={{ paddingX: "16px", mb: "4px" }}>
              <ColorPickerField
                label={t('stroke_color')}
                name={isJpg ? "textOutlineColorJpg" : (isPng ? "textOutlineColorPng" : "textOutlineColor")}
                value={isJpg ? settings.textOutlineColorJpg : (isPng ? settings.textOutlineColorPng : settings.textOutlineColor)}
                onChange={handleSettingsChange}
                sx={{ mt: 2 }}
              />

              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width')} {isJpg ? settings.textOutlineWidthJpg : (isPng ? settings.textOutlineWidthPng : settings.textOutlineWidth)}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isJpg ? "textOutlineWidthJpg" : (isPng ? "textOutlineWidthPng" : "textOutlineWidth")}
                    value={isJpg ? settings.textOutlineWidthJpg : (isPng ? settings.textOutlineWidthPng : settings.textOutlineWidth)}
                    min={0}
                    max={4}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_blur')} {isJpg ? settings.textOutlineBlurJpg : (isPng ? settings.textOutlineBlurPng : settings.textOutlineBlur)}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isJpg ? "textOutlineBlurJpg" : (isPng ? "textOutlineBlurPng" : "textOutlineBlur")}
                    value={isJpg ? settings.textOutlineBlurJpg : (isPng ? settings.textOutlineBlurPng : settings.textOutlineBlur)}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('stroke_detail')} {settings.textOutlineDetailing}
                </Typography>
                <Slider
                  name={"textOutlineDetailing"}
                  value={settings.textOutlineDetailing}
                  min={20}
                  max={60}
                  step={10}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}`}
                />
              </Box>
            </Box>
            <Divider />
          </CollapseField>

          <Divider />

          <Typography
            sx={{
              padding: "8px 16px 2px 16px",
              color: "text.secondary"
            }}>
            {t('back_side_settings')}
          </Typography>

          <CollapseField
            title={t('image')}
            icon={WallpaperOutlinedIcon}
            subIcon={CachedOutlinedIcon}
            disabled={!showShowBacksSettings}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <CardBackgroundSelector
                label={t('cards_background')}
                dialogLabel={t('select_background')}
                backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                addLocalBackground={addLocalBackground} deleteLocalBackground={deleteLocalBackground}
                name="backCardBackground"
                value={settings.backCardBackground}
                onChange={handleSettingsChange}
                userData={userData}
                sx={{ mt: "12px" }}
              />

              <FormControlLabel
                label={t('overlay_on_image')}
                name="backCardBackgroundOverImage"
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name="backCardBackgroundOverImage"
                    checked={settings.backCardBackgroundOverImage}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{t('image_insert_mode')}</InputLabel>
                <Select
                  label={t('image_insert_mode')}
                  name={"backCardBackgroundFit"}
                  value={settings.backCardBackgroundFit}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="contain">Contain</MenuItem>
                  <MenuItem value="cover">Cover</MenuItem>
                  <MenuItem value="fill">Fill</MenuItem>
                </Select>
              </FormControl>


              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {t('opacity')} {Math.round(settings.backCardBackgroundOpacity * 100)}%
                  </Typography>
                  <Slider
                    name="backCardBackgroundOpacity"
                    value={settings.backCardBackgroundOpacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>

                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {t('blur')} {settings.backCardBackgroundBlur}{t('unit_px')}
                  </Typography>
                  <Slider
                    name="backCardBackgroundBlur"
                    value={settings.backCardBackgroundBlur}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />

                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('brightness')} {settings.backCardBackgroundBrightness}
                  </Typography>
                  <Slider
                    name={"backCardBackgroundBrightness"}
                    value={settings.backCardBackgroundBrightness}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('saturation')} {settings.backCardBackgroundSaturate}
                  </Typography>
                  <Slider
                    name={"backCardBackgroundSaturate"}
                    value={settings.backCardBackgroundSaturate}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('contrast')} {settings.backCardBackgroundContrast}
                  </Typography>
                  <Slider
                    name={"backCardBackgroundContrast"}
                    value={settings.backCardBackgroundContrast}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('hue')} {settings.backCardBackgroundHueRotate}°
                  </Typography>
                  <Slider
                    name={"backCardBackgroundHueRotate"}
                    value={settings.backCardBackgroundHueRotate}
                    min={-180}
                    max={180}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>
              </Box>

            </Box>
            <Divider />
          </CollapseField>

          <CollapseField
            title={t('patterned_background')}
            icon={TextureOutlinedIcon}
            subIcon={CachedOutlinedIcon}
            disabled={!showShowBacksSettings}
          >

            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "12px" }}>
                <ColorPickerField
                  label={t('background_color')}
                  name="backCardPatternBackgroundColor"
                  value={settings.backCardPatternBackgroundColor}
                  onChange={handleSettingsChange}
                  disabled={settings.backCardPatternBackgroundUseTeamColor}
                />

                <Button
                  variant={settings.backCardPatternBackgroundUseTeamColor ? "contained" : "outlined"}
                  name={"backCardPatternBackgroundUseTeamColor"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  label={t('seed')}
                  name="backCardPatternSeed"
                  value={settings.backCardPatternSeed}
                  onChange={(e) => updateSetting("backCardPatternSeed", e.target.value)}
                  disabled={settings.backCardUniquePatternSeed}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" size="small"
                            onClick={() => updateSetting("backCardPatternSeed", generateRandomString())}
                            disabled={settings.backCardUniquePatternSeed}
                          >
                            <AutorenewOutlinedIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />
                <Button
                  variant={settings.backCardUniquePatternSeed ? "contained" : "outlined"}
                  name={"backCardUniquePatternSeed"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                    mt: 2,
                  }}>
                  {t('unique_seeds')}
                </Button>
              </Box>


              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <ColorPickerField
                  label={t('objects_color')}
                  name={"backCardPatternColor"}
                  value={settings.backCardPatternColor}
                  onChange={handleSettingsChange}
                  disabled={settings.backCardPatternUseTeamColor}
                />
                <Button
                  variant={settings.backCardPatternUseTeamColor ? "contained" : "outlined"}
                  name={"backCardPatternUseTeamColor"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('objects_count')} {settings.backCardPatternShapesCount}{t('unit_pcs')}
                </Typography>
                <Slider
                  name={"backCardPatternShapesCount"}
                  value={settings.backCardPatternShapesCount}
                  min={0}
                  max={100}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_pcs')}`}
                />
              </Box>

              <Typography variant="body1" sx={{ mt: 0, mb: "4px" }}>
                {t('shape_types')}
              </Typography>
              <ToggleButtonGroup
                value={settings.backCardPatternSelectedShapes}
                onChange={(_, newShapes) => updateSetting("backCardPatternSelectedShapes", newShapes)}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {patternShapes.map((shape) => (
                    <ToggleButton key={shape} value={shape} color="primary" size="small">
                      {shape}
                    </ToggleButton>
                  ))}
                </Box>
              </ToggleButtonGroup>


              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_size')} {settings.backCardPatternMinSize}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"backCardPatternMinSize"}
                    value={settings.backCardPatternMinSize}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_size')} {settings.backCardPatternMaxSize}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"backCardPatternMaxSize"}
                    value={settings.backCardPatternMaxSize}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_opacity')} {Math.round(settings.backCardPatternMinOpacity * 100)}%
                  </Typography>
                  <Slider
                    name={"backCardPatternMinOpacity"}
                    value={settings.backCardPatternMinOpacity}
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_opacity')} {Math.round(settings.backCardPatternMaxOpacity * 100)}%
                  </Typography>
                  <Slider
                    name={"backCardPatternMaxOpacity"}
                    value={settings.backCardPatternMaxOpacity}
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('min_rotation')} {settings.backCardPatternMinRotate}°
                  </Typography>
                  <Slider
                    name={"backCardPatternMinRotate"}
                    value={settings.backCardPatternMinRotate}
                    min={-180}
                    max={0}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('max_rotation')} {settings.backCardPatternMaxRotate}°
                  </Typography>
                  <Slider
                    name={"backCardPatternMaxRotate"}
                    value={settings.backCardPatternMaxRotate}
                    min={0}
                    max={180}
                    step={5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('dead_zone')} {settings.backCardPatternDeadZone}
                </Typography>
                <Slider
                  name={"backCardPatternDeadZone"}
                  value={settings.backCardPatternDeadZone}
                  min={0}
                  max={2}
                  step={0.1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value}
                />
              </Box>

            </Box>
            <Divider />
          </CollapseField>


          <CollapseField
            title={t('stroke')}
            icon={CardOutlineIcon}
            subIcon={CachedOutlinedIcon}
            disabled={!showShowBacksSettings}
            muted={!settings.showBackCardBorder}
          >
            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              <FormControlLabel
                label={t('show_stroke')}
                name={"showBackCardBorder"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={"showBackCardBorder"}
                    checked={settings.showBackCardBorder}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <FormControlLabel
                label={t('trim_to_border')}
                name={"backCardBorderClipContent"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={"backCardBorderClipContent"}
                    checked={settings.backCardBorderClipContent}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('stroke_variant')}
              </Typography>

              <ToggleButtonGroup
                name="backCardBorderVersion"
                value={settings.backCardBorderVersion}
                onChange={(e) => updateSetting("backCardBorderVersion", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="css" sx={{ padding: "6px 12px 4px 12px" }}>
                  CSS
                </ToggleButton>
                <ToggleButton value="svg" sx={{ padding: "6px 12px 4px 12px" }}>
                  SVG
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                label={t('overlay_on_image')}
                name={isBackCardCssBorder ? "backCardBorderOverImageCss" : "backCardBorderOverImageSvg"}
                sx={{ mt: 1, width: "100%" }}
                control={
                  <Switch
                    name={isBackCardCssBorder ? "backCardBorderOverImageCss" : "backCardBorderOverImageSvg"}
                    checked={isBackCardCssBorder ? settings.backCardBorderOverImageCss : settings.backCardBorderOverImageSvg}
                    onChange={handleSettingsChange}
                  />
                }
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <ColorPickerField
                  label={t('stroke_color')}
                  name={isBackCardCssBorder ? "backCardBorderColorCss" : "backCardBorderColorSvg"}
                  value={isBackCardCssBorder ? settings.backCardBorderColorCss : settings.backCardBorderColorSvg}
                  onChange={handleSettingsChange}
                  disabled={isBackCardCssBorder ? settings.backCardBorderUseTeamColorCss : settings.backCardBorderUseTeamColorSvg}
                />
                <Button
                  variant={isBackCardCssBorder
                    ? settings.backCardBorderUseTeamColorCss ? "contained" : "outlined"
                    : settings.backCardBorderUseTeamColorSvg ? "contained" : "outlined"}
                  name={isBackCardCssBorder ? "backCardBorderUseTeamColorCss" : "backCardBorderUseTeamColorSvg"}
                  onClick={handleToggleBorderTeamColor}
                  sx={{
                    lineHeight: "1.5",
                    padding: "6px",
                  }}>
                  {t('team_color')}
                </Button>
              </Box>

              {isBackCardCssBorder && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>{t('stroke_style')}</InputLabel>
                  <Select
                    label={t('stroke_style')}
                    name={"backCardBorderStyleCss"}
                    value={settings.backCardBorderStyleCss}
                    onChange={handleSettingsChange}
                  >
                    <MenuItem value="solid">Solid</MenuItem>
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="groove">Groove</MenuItem>
                    <MenuItem value="ridge">Ridge</MenuItem>
                    <MenuItem value="inset">Inset</MenuItem>
                    <MenuItem value="outset">Outset</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t('stroke_width_x')} {isBackCardCssBorder ? settings.backCardBorderWidthXCss : settings.backCardBorderWidthXSvg}{t('unit_px')}
                </Typography>
                <Slider
                  name={isBackCardCssBorder ? "backCardBorderWidthXCss" : "backCardBorderWidthXSvg"}
                  value={isBackCardCssBorder ? settings.backCardBorderWidthXCss : settings.backCardBorderWidthXSvg}
                  min={0}
                  max={32}
                  step={1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width_top')} {isBackCardCssBorder ? settings.backCardBorderWidthTopCss : settings.backCardBorderWidthTopSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isBackCardCssBorder ? "backCardBorderWidthTopCss" : "backCardBorderWidthTopSvg"}
                    value={isBackCardCssBorder ? settings.backCardBorderWidthTopCss : settings.backCardBorderWidthTopSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width_bottom')} {isBackCardCssBorder ? settings.backCardBorderWidthBottomCss : settings.backCardBorderWidthBottomSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isBackCardCssBorder ? "backCardBorderWidthBottomCss" : "backCardBorderWidthBottomSvg"}
                    value={isBackCardCssBorder ? settings.backCardBorderWidthBottomCss : settings.backCardBorderWidthBottomSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                <Box sx={{ flex: 1, }}>
                  <Typography gutterBottom>
                    {isBackCardCssBorder ? t('radius') : t('outer_radius')}  {isBackCardCssBorder ? settings.backCardBorderOuterRadiusCss : settings.backCardBorderOuterRadiusSvg}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={isBackCardCssBorder ? "backCardBorderOuterRadiusCss" : "backCardBorderOuterRadiusSvg"}
                    value={isBackCardCssBorder ? settings.backCardBorderOuterRadiusCss : settings.backCardBorderOuterRadiusSvg}
                    min={0}
                    max={48}
                    step={1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                {!isBackCardCssBorder && (
                  <Box sx={{ flex: 1, }}>
                    <Typography gutterBottom>
                      {t('inner_radius')} {settings.backCardBorderInnerRadiusSvg}{t('unit_px')}
                    </Typography>
                    <Slider
                      name={"backCardBorderInnerRadiusSvg"}
                      value={settings.backCardBorderInnerRadiusSvg}
                      min={0}
                      max={48}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>
                )}
              </Box>

            </Box>
            <Divider />
          </CollapseField>

          <CollapseField
            title={t('text_block')}
            icon={FormatShapesOutlinedIcon}
            subIcon={CachedOutlinedIcon}
            disabled={!showShowBacksSettings}
          >

            <Box sx={{ mb: "4px" }}>
              {/* ------- TEXT SETTINGS------- */}


              {/* ------- TEXT SETTINGS 1------- */}
              <Box sx={{ paddingX: "16px", mb: "8px" }}>
                {/* ------- TEXT LOCATION------- */}
                <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                  {t('text_position')}
                </Typography>

                <ToggleButtonGroup
                  name="backCardTextPosition"
                  value={settings.backCardTextPosition}
                  onChange={(e) => updateSetting("backCardTextPosition", e.target.value)}
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="end" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('text_position_bottom')}
                  </ToggleButton>
                  <ToggleButton value="center" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('text_position_center')}
                  </ToggleButton>
                  <ToggleButton value="start" sx={{ padding: "6px 12px 4px 12px" }}>
                    {t('text_position_top')}
                  </ToggleButton>
                </ToggleButtonGroup>


                {/* ------- TEXT PADDING X------- */}
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_left')} {settings.backCardTextPaddingLeft}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="backCardTextPaddingLeft"
                      value={settings.backCardTextPaddingLeft}
                      min={0}
                      max={16}
                      step={0.5}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>

                  {/* ------- TEXT PADDING Y------- */}
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_right')} {settings.backCardTextPaddingRight}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="backCardTextPaddingRight"
                      value={settings.backCardTextPaddingRight}
                      min={0}
                      max={16}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 3, mt: 0 }}>
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_top')} {settings.backCardTextPaddingTop}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="backCardTextPaddingTop"
                      value={settings.backCardTextPaddingTop}
                      min={0}
                      max={32}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>

                  {/* ------- TEXT PADDING Y------- */}
                  <Box sx={{ flex: 1, }}>
                    <Typography variant="body1" gutterBottom>
                      {t('offset_bottom')} {settings.backCardTextPaddingBottom}{t('unit_px')}
                    </Typography>
                    <Slider
                      name="backCardTextPaddingBottom"
                      value={settings.backCardTextPaddingBottom}
                      min={0}
                      max={32}
                      step={1}
                      onChange={handleSettingsChange}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 0 }}>
                  <Typography variant="body1" gutterBottom>
                    {t('rotation')} {settings.backCardTextBoxRotate}°
                  </Typography>
                  <Slider
                    name="backCardTextBoxRotate"
                    value={settings.backCardTextBoxRotate}
                    min={-180}
                    max={180}
                    step={2}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}°`}
                  />
                </Box>

              </Box>
            </Box>

            <Divider />
          </CollapseField>

          <CollapseField
            title={t('text')}
            icon={TextFieldsOutlinedIcon}
            subIcon={CachedOutlinedIcon}
            disabled={!showShowBacksSettings}
          >
            {/* ------- TEXT SETTINGS 3 ------- */}
            <Box sx={{ paddingX: "16px", mb: "12px" }}>

              <TextField
                label={t('back_side_text')}
                name="backCardText"
                value={settings.backCardText}
                onChange={(e) => updateSetting("backCardText", e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mt: "12px" }}
              />

              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('text_alignment')}
              </Typography>

              <ToggleButtonGroup
                name="backCardTextAlign"
                value={settings.backCardTextAlign}
                onChange={(e) => updateSetting("backCardTextAlign", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="left" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_left')}
                </ToggleButton>
                <ToggleButton value="center" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_center')}
                </ToggleButton>
                <ToggleButton value="right" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('align_right')}
                </ToggleButton>
              </ToggleButtonGroup>

              {/* ------- TEXT FONT------- */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{t('font')}</InputLabel>
                <Select
                  label={t('font')}
                  name="backCardFontFamily"
                  value={settings.backCardFontFamily}
                  onChange={handleSettingsChange}
                >
                  {availableFonts.map((font) => (
                    <MenuItem
                      key={font}
                      value={font}
                      sx={{ fontFamily: `${font}, sans-serif` }}
                    >
                      {font}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>

              {/* ------- TEXT FONT------- */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{t('font_style')}</InputLabel>
                <Select
                  label={t('font_style')}
                  name="backCardFontStyle"
                  value={settings.backCardFontStyle}
                  onChange={handleSettingsChange}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="italic">Italic</MenuItem>
                  <MenuItem value="oblique">Oblique</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body1" sx={{ mt: 1, mb: "4px" }}>
                {t('text_case')}
              </Typography>

              <ToggleButtonGroup
                name="backCardTextCase"
                value={settings.backCardTextCase}
                onChange={(e) => updateSetting("backCardTextCase", e.target.value)}
                exclusive
                fullWidth
              >
                <ToggleButton value="lowercase" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_lowercase')}
                </ToggleButton>
                <ToggleButton value="none" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_original')}
                </ToggleButton>
                <ToggleButton value="uppercase" sx={{ padding: "6px 12px 4px 12px" }}>
                  {t('text_case_uppercase')}
                </ToggleButton>
              </ToggleButtonGroup>

            </Box>

            <Divider sx={{ marginX: 2 }} />

            <Box sx={{ paddingX: "16px", mb: "4px" }}>

              {/* ------- TEXT COLOR------- */}
              <ColorPickerField
                label={t('text_color')}
                name={"backCardTextColor"}
                value={settings.backCardTextColor}
                onChange={handleSettingsChange}
                sx={{ mt: 2 }}
              />

              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('font_size')} {settings.backCardFontSize}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"backCardFontSize"}
                    value={settings.backCardFontSize}
                    min={1}
                    max={100}
                    step={0.5}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>

                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('font_weight')} {settings.backCardFontWeight}
                  </Typography>
                  <Slider
                    name={"backCardFontWeight"}
                    value={settings.backCardFontWeight}
                    min={100}
                    max={900}
                    step={100}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}`}
                  />
                </Box>
              </Box>

              {/* ------- TEXT LETTER SPACING------- */}
              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('letter_spacing')} {settings.backCardLetterSpacing}{t('unit_px')}
                </Typography>
                <Slider
                  name={"backCardLetterSpacing"}
                  value={settings.backCardLetterSpacing}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                />
              </Box>

              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('line_height')} {settings.backCardTextLineHeight}
                </Typography>
                <Slider
                  name="backCardTextLineHeight"
                  value={settings.backCardTextLineHeight}
                  min={0.8}
                  max={2}
                  step={0.1}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}`}
                />
              </Box>
            </Box>

            <Divider sx={{ marginX: 2 }} />

            {/* ------- TEXT SETTINGS 3 ------- */}
            <Box sx={{ paddingX: "16px", mb: "4px" }}>
              <ColorPickerField
                label={t('stroke_color')}
                name={"backCardTextOutlineColor"}
                value={settings.backCardTextOutlineColor}
                onChange={handleSettingsChange}
                sx={{ mt: 2 }}
              />

              <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_width')} {settings.backCardTextOutlineWidth}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"backCardTextOutlineWidth"}
                    value={settings.backCardTextOutlineWidth}
                    min={0}
                    max={4}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
                {/* ------- TEXT FONT SIZE------- */}
                <Box sx={{ flex: 1, }}>
                  <Typography variant="body1" gutterBottom>
                    {t('stroke_blur')} {settings.backCardTextOutlineBlur}{t('unit_px')}
                  </Typography>
                  <Slider
                    name={"backCardTextOutlineBlur"}
                    value={settings.backCardTextOutlineBlur}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={handleSettingsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}${t('unit_px')}`}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 0 }}>
                <Typography variant="body1" gutterBottom>
                  {t('stroke_detail')} {settings.backCardTextOutlineDetailing}
                </Typography>
                <Slider
                  name={"backCardTextOutlineDetailing"}
                  value={settings.backCardTextOutlineDetailing}
                  min={20}
                  max={60}
                  step={10}
                  onChange={handleSettingsChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}`}
                />
              </Box>
            </Box>
            <Divider />

          </CollapseField>

          <Divider />

          <Typography
            sx={{
              padding: "8px 16px 2px 16px",
              color: "text.secondary"
            }}>
            {t('other_settings')}
          </Typography>


          {/* ------- OTHER BOX------- */}
          <CollapseField
            title={t('miscellaneous')}
            icon={InterestsOutlinedIcon} >
            <Box sx={{ paddingX: "16px", mb: "8px" }}>

              {/* ------- INTERACTION------- */}
              <FormControlLabel
                label={t('settings_disable_interaction')}
                name="disableInteraction"
                sx={{ mt: 0, width: "100%" }}
                control={
                  <Switch
                    checked={userData.disableInteraction}
                    onChange={handleUserDataChange}
                  />
                }
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  fontStyle: 'italic',
                }}>
                {t('image_interaction_hint')}
              </Typography>

            </Box>
            <Divider />
          </CollapseField>
        </Box>
      </ScrollableBox >

      <Divider />
      <Box sx={{ paddingX: "16px", marginY: "12px" }}>
        <Button
          startIcon={< FileDownloadOutlinedIcon />}
          variant="contained"
          onClick={() => setDownloadDialogOpen(true)}
          size="large"
          fullWidth
          sx={{ paddingY: "10px", }}
        >
          <Typography>
            {t('download')}
          </Typography>

        </Button>

        <DownloadDialog
          open={downloadDialogOpen}
          onClose={() => setDownloadDialogOpen(false)}
          paperFormat={settings.paperFormat}
          paperWidth={settings.paperWidth}
          paperHeight={settings.paperHeight}
          paperOrientation={settings.orientation}
        />
      </Box>
    </Box >
  );
}

export default SettingsPanel;

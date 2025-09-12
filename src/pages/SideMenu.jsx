import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Grid,
} from "@mui/material";


// ICONS
import ClearIcon from "@mui/icons-material/Clear";
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

// COMPONENTS
import CardItem from "./components/CardItem";
import TabPanel from "./components/TabPanel";
import ScrollableBox from "./components/ScrollableBox";
import CollapseField from "./components/CollapseField";
import UploadImageButton from "./components/UploadImageButton";
import SortButton from "./components/SortButton";
import CardSettingsDialog from "./dialogs/CardSettingsDialog";

import ConfirmDeleteCardsDialog from "./dialogs/ConfirmDeleteCardsDialog";
import ConfirmResetCardsDialog from "./dialogs/ConfirmResetCardsDialog";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { getJsonTranslation } from "../i18n/getJsonTranslation";
import { alpha } from "@mui/system";
import UploadPackDialog from "./dialogs/UploadPackDialog";
import ConfirmUploadPackDialog from "./dialogs/ConfirmUploadPackDialog";
import { preparePackFile } from "../hooks/preparPackFile";
import DataManagerDialog from "./dialogs/DataManagerDialog";

const PAGE_SIZE = 120; // (НОК 2,3,4,5,6)*2

function sortCards(cardsArray, sortOrder, userData) {
  if (sortOrder === "name") {
    return [...cardsArray].sort((a, b) => getJsonTranslation(a.name, userData).localeCompare(getJsonTranslation(b.name, userData)));
  } else if (sortOrder === "id") {
    return [...cardsArray].sort((a, b) => String(a.id ?? "").localeCompare(String(b.id ?? "")));
  } else if (sortOrder === "category") {
    return [...cardsArray].sort((a, b) => {
      const catA = a.categories?.[0] || "";
      const catB = b.categories?.[0] || "";
      return catA.localeCompare(catB);
    });
  }
  return cardsArray; // "none"
}

function sortItems(itemsArray, sortOrder, userData) {
  if (sortOrder === "name") {
    return [...itemsArray].sort((a, b) => getJsonTranslation(a.name, userData).localeCompare(getJsonTranslation(b.name, userData)));
  } else if (sortOrder === "id") {
    return [...itemsArray].sort((a, b) => String(a.id ?? "").localeCompare(String(b.id ?? "")));
  }
  return itemsArray; // "none"
}


function SideMenu({
  cards, categories, sets,
  selectedCards, setSelectedCards,
  editedCards, setEditedCards,
  localCards, addLocalCard, addMultipleLocalCards, updateLocalCard, deleteLocalCard, clearLocalCards,
  localCategories, addMultipleLocalCategories, clearLocalCategories,
  localSets, addMultipleLocalSets, clearLocalSets,
  localBackgrounds, addMultipleLocalBackgrounds, clearLocalBackgrounds,
  backgrounds,
  userData, setUserData, isUserDataLoading,
  settings, setSettings,
  searchQuery, setSearchQuery,
  tabIndex, setTabIndex,
  sx = {}
}) {
  const theme = useTheme();
  const { t } = useTranslation(); // connect i18next

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [openResetEditedCardsDialog, setOpenResetEditedCardsDialog] = useState(false);
  const [openDeleteLocalCardsDialog, setOpenDeleteLocalCardsDialog] = useState(false);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [preparedCards, setPreparedCards] = useState(null);
  const [preparedCategories, setPreparedCategories] = useState(null);
  const [preparedSets, setPreparedSets] = useState(null);
  const [preparedBackgrounds, setPreparedBackgrounds] = useState(null);

  const [openUploadPackDialog, setOpenUploadPackDialog] = useState(false);
  const [openConfirmUploadPackDialog, setOpenConfirmUploadPackDialog] = useState(false);
  const [openDataManagerDialog, setOpenDataManagerDialog] = useState(false);


  // ---------- Select ----------
  const handleToggleAll = (cards) => {
    setSelectedCards((prevSelected) => {
      const allSelected = cards.every((card) => prevSelected.has(card.id));
      const newSelected = new Set(prevSelected);

      if (allSelected) {
        // If all cards have already been selected, remove them.
        cards.forEach((card) => newSelected.delete(card.id));
      } else {
        // Otherwise, add all the cards.
        cards.forEach((card) => newSelected.add(card.id));
      }

      return newSelected;
    });
  };

  const handleCardClick = (cardId) => {
    setSelectedCards((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId); // Remove the card if it has already been selected.
      } else {
        newSelected.add(cardId); // Add a card
      }
      return newSelected;
    });
  };

  const handleResetSelected = async () => {
    for (const id of selectedCards) {
      setEditedCards((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
    setSelectedCards(new Set()); // Clear selection after deletion
    setOpenResetEditedCardsDialog(false);
  };

  // ---------- Cards ----------
  const cardsArr = useMemo(() => {
    const allCards = Array.from([...cards.values(), ...localCards.values()]);
    return sortCards(allCards, userData.sortOrder, userData);
  }, [cards, localCards, userData.sortOrder]);

  const allLocalSelected = useMemo(() => {
    if (localCards.size === 0) return false;
    return Array.from(localCards.values()).every(card => selectedCards.has(card.id));
  }, [localCards, selectedCards]);

  const handleDeleteLocalSelected = async () => {
    for (const id of selectedCards) {
      await deleteLocalCard(id);
    }
    setSelectedCards(new Set()); // Clear selection after deletion
    setOpenDeleteLocalCardsDialog(false);
  };

  // ---------- Search Cards ----------
  const searchResults = useMemo(() => {

    const filtered = searchQuery
      ? cardsArr.filter((card) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          getJsonTranslation(card.name, userData).toLowerCase()?.includes(lowerQuery) ||
          String(card.id ?? "").toLowerCase()?.includes(lowerQuery)
        );
      })
      : cardsArr;

    return sortCards(filtered, userData.sortOrder, userData);

  }, [searchQuery, cardsArr, userData.sortOrder]);

  const allSearchSelected = (searchResults.length > 0)
    && Array.from(searchResults.values()).every(card => selectedCards.has(card.id));

  // ---------- Edited Cards ----------
  const editedCardsList = useMemo(() => {
    const base = Array.from(cards.values()).filter((card) => editedCards[card.id]);
    return sortCards(base, userData.sortOrder, userData);
  }, [cards, editedCards, userData.sortOrder]);

  const allEditedSelected = (editedCardsList.length > 0)
    && editedCardsList.every((card) => selectedCards.has(card.id));

  useEffect(() => {
    if (tabIndex === 3 && editedCardsList.length === 0) {
      setTabIndex(1);
    }
  }, [tabIndex, editedCardsList.length, setTabIndex]);

  // ---------- Category Cards ----------
  const categoriesArr = useMemo(() => {
    const allCategories = Array.from([...categories.values(), ...localCategories.values()]);
    return sortItems(allCategories, userData.sortOrder);
  }, [categories, localCategories, userData.sortOrder]);

  const cardsByCategory = useMemo(() => {
    const sortedCategories = sortItems(categoriesArr, userData.sortOrder);

    return sortedCategories.map((category) => ({
      category,
      cards: sortCards(
        cardsArr.filter((card) =>
          card.categories?.includes(category.id)
        ),
        userData.sortOrder,
        userData
      ),
    }));
  }, [categoriesArr, cardsArr, userData.sortOrder]);

  // ---------- Set Cards ----------
  const setsArr = useMemo(() => {
    const allSets = Array.from([...sets.values(), ...localSets.values()]);
    return sortItems(allSets, userData.sortOrder);
  }, [sets, localSets, userData.sortOrder]);

  const cardsBySet = useMemo(() => {
    const sortedSets = sortItems(setsArr, userData.sortOrder);

    return sortedSets.map((set) => ({
      set,
      cards: sortCards(
        cardsArr.filter((card) =>
          set.cards?.includes(card.id)
        ),
        userData.sortOrder,
        userData
      ),
    }));
  }, [setsArr, cardsArr, userData.sortOrder]);

  // ---------- Backgrounds ----------
  const backgroundsArr = useMemo(() => {
    const allBackgrounds = Array.from([...backgrounds.values(), ...localBackgrounds.values()]);
    return sortItems(allBackgrounds, userData.sortOrder);
  }, [backgrounds, localBackgrounds, userData.sortOrder]);

  // ---------- Pack Upload ----------
  const handlePreparePack = async (file, setError) => {
    const { cards, categories, sets, backgrounds } = await preparePackFile(file, setError);
    if (cards || categories || sets || backgrounds) {
      setPreparedCards(cards);
      setPreparedCategories(categories);
      setPreparedSets(sets);
      setPreparedBackgrounds(backgrounds);

      setOpenUploadPackDialog(false);
      setOpenConfirmUploadPackDialog(true);
    }
  };

  const handleConfirmUpload = async (mode) => {
    const replace = (mode === "replace");
    await addMultipleLocalCards(preparedCards, replace);
    await addMultipleLocalCategories(preparedCategories, replace);
    await addMultipleLocalSets(preparedSets, replace);
    await addMultipleLocalBackgrounds(preparedBackgrounds, replace);

    setPreparedCards(null);
    setOpenConfirmUploadPackDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        flexDirection: "column",
        // height: "auto",
        // flex: 1,
        ...sx,
      }}>
      {/* ------- TITLE BOX ------- */}
      <Box display="flex"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px",
          paddingLeft: "16px",
          gap: 1,
        }}
      >

        <Box display="flex" alignItems="center" gap={1}>
          {/* ------- TITLE ------- */}
          <Typography
            sx={{
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            {t('total_cards_count')}
          </Typography>

          {/* ------- COUNTER ------- */}
          <Box
            sx={{
              display: "table",
              border: "1px solid",
              borderRadius: "4px",
              borderColor: alpha(theme.palette.primary.main, 0.5),
              padding: "4px 12px",
              minWidth: "32px",
            }}
          >
            <Typography
              sx={{
                color: "primary.main",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {cardsArr.length}
            </Typography>

          </Box>
        </Box>

        <Box display="flex" gap={1}>
          {/* ------- SORT ------- */}
          <SortButton
            initialValue={isUserDataLoading ? null : userData.sortOrder}
            onSortChange={(sortType) =>
              setUserData({ ...userData, sortOrder: sortType })}
          />

          {/* ------- CARD SETTINGS ------- */}
          <Box sx={{ alignContent: "center" }}>
            <IconButton aria-label="settings" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>

            <CardSettingsDialog
              open={isSettingsOpen}
              onClose={() => setSettingsOpen(false)}
              userData={userData}
              setUserData={setUserData}
            />
          </Box>

        </Box>
      </Box>

      {/* ------- SEARCH ------- */}

      <Box display="flex"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2px 16px 8px 16px",
          gap: 1,
        }}
      >
        <TextField
          className="search-input"
          label={t('card_search_placeholder')}
          value={searchQuery}
          fullWidth
          // size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    sx={{ padding: 0 }}
                    onClick={() => setSearchQuery("")}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ------- SEARCH ONLY ------- */}
      {
        searchQuery ? (
          <Box display={"contents"} >
            <Box
              display="flex"
              gap={1}
              sx={{
                alignItems: "center",
                padding: "6px 16px",
                borderBottom: 1,
                borderColor: "divider"
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                {t('cards_found_count')} {searchResults.length}
              </Typography>
            </Box>

            <ScrollableBox>
              <FormControlLabel
                label={t('select_all')}
                sx={{ width: "100%", paddingX: "20px", marginY: "4px", mr: 0 }}
                control={
                  <Checkbox
                    checked={allSearchSelected}
                    onChange={() => handleToggleAll(searchResults)}
                  />
                }
              />
              <Box>
                <Grid container spacing={1} sx={{ padding: "0px 12px 8px 12px" }}>
                  {searchResults.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      editedCards={editedCards} setEditedCards={setEditedCards}
                      isSelected={selectedCards.has(card.id)}
                      onClick={() => handleCardClick(card.id)}
                      isLocalCard={localCards.has(card.id)}
                      updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                      userData={userData}
                    />
                  ))}
                </Grid>
              </Box>
            </ScrollableBox>
          </Box>
        ) : (
          <>
            {/* ------- TAB BOX ------- */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabIndex}
                variant="scrollable"
                scrollButtons="auto"
                onChange={(_, newIndex) => setTabIndex(newIndex)}
                aria-label="basic-tabs-list"
                sx={{
                  ".MuiTab-root": {
                    padding: "12px 16px",
                  },
                  ".MuiTabScrollButton-root": {
                    width: "32px",
                    // transition: "width 0.8s ease-in-out",
                    transition: "opacity 0.1s ease-in-out",
                  },
                  ".MuiTabScrollButton-root.Mui-disabled": {
                    // width: 0,
                    opacity: 0.2,
                  },
                }}
              >
                {/* ------- TABS ------- */}
                <Tab icon={<AllInclusiveOutlinedIcon />} label={t('menu_all')} value={0} />
                <Tab icon={<CategoryOutlinedIcon />} label={t('menu_categories')} value={1} />
                <Tab icon={<Inventory2OutlinedIcon />} label={t('menu_sets')} value={2} />
                {editedCardsList.length > 0 && (
                  <Tab icon={<BorderColorOutlinedIcon />} label={t('menu_modified')} value={3} />
                )}
                <Tab icon={<PersonOutlineOutlinedIcon />} label={t('menu_local')} value={4} />
              </Tabs>
            </Box>

            <ScrollableBox>
              {/* ------- TAB PANEL 1 ------- */}
              <TabPanel value={tabIndex} index={0}>
                {/* ------- ALL ------- */}
                <ScrollableBox>
                  <Grid container spacing={1} sx={{ padding: "8px 12px" }}>
                    {cardsArr.length === 0 && (
                      <Typography sx={{ color: "text.secondary" }}>
                        {t('empty')}
                      </Typography>
                    )}
                    {cardsArr.slice(0, Math.min(visibleCount, cardsArr.length)).map((card) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        editedCards={editedCards} setEditedCards={setEditedCards}
                        isSelected={selectedCards.has(card.id)}
                        onClick={() => handleCardClick(card.id)}
                        isLocalCard={localCards.has(card.id)}
                        updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                        userData={userData}
                      />
                    ))}
                  </Grid>

                  {/* <div ref={sentinelRef} style={{ backgroundColor: "red", height: "10px" }} /> */}

                  {visibleCount < cardsArr.length && (
                    <Box sx={{ paddingX: "12px", pb: "8px" }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setVisibleCount(Math.min(visibleCount + PAGE_SIZE, cardsArr.length));
                        }}
                      >
                        <ExpandMoreOutlinedIcon sx={{ mr: "4px", ml: "-2px" }} />
                        <Typography>
                          {t('show_more')}
                        </Typography>
                      </Button>
                    </Box>
                  )}

                </ScrollableBox>
              </TabPanel>

              {/* ------- TAB PANEL 2 ------- */}
              <TabPanel value={tabIndex} index={1}>
                {/* ------- CATEGORIES ------- */}
                {cardsByCategory.map(({ category, cards }) => {
                  const allSelected = cards.every((card) => selectedCards.has(card.id));
                  const isLocal = localCategories.has(category.id);

                  return (
                    <CollapseField
                      key={category.id}
                      image={isLocal
                        ? category.image
                        : import.meta.env.BASE_URL + `categories/images/${category.imagePath}`
                      }
                      title={getJsonTranslation(category.name, userData)}
                      counter={cards.length}
                      hoverOnExpand={false}
                    >

                      <FormControlLabel
                        label={t('select_all')}
                        sx={{ width: "100%", paddingX: "20px", marginY: "4px", mr: 0 }}
                        control={
                          <Checkbox
                            checked={allSelected}
                            onChange={() => handleToggleAll(cards)}
                          />
                        }
                      />

                      <Grid container spacing={1} sx={{ padding: "0px 12px 8px 12px" }}>
                        {cards.length === 0 && (
                          <Typography sx={{ color: "text.secondary" }}>
                            {t('empty')}
                          </Typography>
                        )}
                        {cards.map((card) => (
                          <CardItem
                            key={card.id}
                            card={card}
                            editedCards={editedCards} setEditedCards={setEditedCards}
                            isSelected={selectedCards.has(card.id)}
                            onClick={() => handleCardClick(card.id)}
                            isLocalCard={localCards.has(card.id)}
                            updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                            userData={userData}
                          />
                        ))}
                      </Grid>
                      <Divider />
                    </CollapseField>
                  )
                })}
              </TabPanel>

              {/* ------- TAB PANEL 3 ------- */}
              <TabPanel value={tabIndex} index={2}>
                {/* ------- SETS ------- */}
                {cardsBySet.map(({ set, cards }) => {
                  const allSelected = cards.every((card) => selectedCards.has(card.id));
                  const backgroundAvailable = backgroundsArr.some(bg => bg.id === set.backgroundId);
                  const isSelectedBackground = settings.cardBackground === set.backgroundId;
                  const isLocal = localSets.has(set.id);

                  return (
                    <CollapseField
                      key={set.id}
                      image={isLocal
                        ? set.image
                        : import.meta.env.BASE_URL + `sets/images/${set.imagePath}`}
                      title={getJsonTranslation(set.name, userData)}
                      subtitle={set.creator}
                      counter={cards.length}
                      hoverOnExpand={false}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <FormControlLabel
                          label={t('select_all')}
                          sx={{ paddingX: "20px", marginY: "4px", mr: 0 }}
                          control={
                            <Checkbox
                              checked={allSelected}
                              onChange={() => handleToggleAll(cards)}
                            />
                          }
                        />

                        {backgroundAvailable && (
                          <Button
                            variant="outlined"
                            onClick={isSelectedBackground
                              ? () => setSettings({ ...settings, cardBackground: null })
                              : () => setSettings({ ...settings, cardBackground: set.backgroundId })}
                            color={isSelectedBackground ? "error" : "primary"}
                            size="small"
                            sx={{
                              display: "block",
                              width: "auto",
                              minWidth: "none",
                              maxWidth: "none",
                              whiteSpace: "nowrap",
                              mr: 2,
                            }}
                          >
                            {isSelectedBackground
                              ? t('remove_background')
                              : t('apply_background')}
                          </Button>
                        )}
                      </Box>

                      <Grid container spacing={1} sx={{ padding: "0px 12px 8px 12px" }}>
                        {cards.length === 0 && (
                          <Typography sx={{ color: "text.secondary" }}>
                            {t('empty')}
                          </Typography>
                        )}
                        {cards.map((card) => (
                          <CardItem
                            key={card.id}
                            card={card}
                            editedCards={editedCards} setEditedCards={setEditedCards}
                            isSelected={selectedCards.has(card.id)}
                            onClick={() => handleCardClick(card.id)}
                            isLocalCard={localCards.has(card.id)}
                            updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                            userData={userData}
                          />
                        ))}
                      </Grid>
                      <Divider />
                    </CollapseField>
                  )
                })}
              </TabPanel>

              {/* ------- TAB PANEL 4 ------- */}
              {editedCardsList.length > 0 && (
                <TabPanel value={tabIndex} index={3} sx={{ padding: "0px" }}>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      label={t('select_all')}
                      sx={{ width: "100%", paddingX: "20px", marginY: "4px", mr: 0 }}
                      control={
                        <Checkbox
                          checked={allEditedSelected}
                          onChange={() => handleToggleAll(editedCardsList)}
                        />
                      }
                    />
                    <IconButton
                      onClick={() => setOpenResetEditedCardsDialog(true)}
                      disabled={selectedCards.size === 0}
                      sx={{ mr: 1 }}
                    >
                      <EditOffOutlinedIcon />
                    </IconButton>
                  </Box>

                  <ConfirmResetCardsDialog
                    open={openResetEditedCardsDialog}
                    onClose={() => setOpenResetEditedCardsDialog(false)}
                    onConfirm={handleResetSelected}
                    counter={selectedCards.size}
                  />

                  <Grid container spacing={1} sx={{ padding: "0px 12px 8px 12px" }}>
                    {editedCardsList.map((card) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        editedCards={editedCards} setEditedCards={setEditedCards}
                        isSelected={selectedCards.has(card.id)}
                        onClick={() => handleCardClick(card.id)}
                        isLocalCard={localCards.has(card.id)}
                        updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                        userData={userData}
                      />
                    ))}
                  </Grid>
                </TabPanel>
              )}

              {/* ------- TAB PANEL 5 ------- */}
              <TabPanel value={tabIndex} index={4} sx={{ padding: "0px" }}>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    label={t('select_all')}
                    sx={{ width: "100%", paddingX: "20px", marginY: "4px", mr: 0 }}
                    control={
                      <Checkbox
                        checked={allLocalSelected}
                        onChange={() => handleToggleAll(Array.from(localCards.values()))}
                      />
                    }
                  />
                  <IconButton
                    onClick={() => setOpenDeleteLocalCardsDialog(true)}
                    disabled={selectedCards.size === 0} // The button is inactive if nothing is selected.
                    sx={{ mr: 1 }}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Box>

                <ConfirmDeleteCardsDialog
                  open={openDeleteLocalCardsDialog}
                  onClose={() => setOpenDeleteLocalCardsDialog(false)}
                  onConfirm={handleDeleteLocalSelected}
                  counter={selectedCards.size}
                />

                <Grid container spacing={1} sx={{ padding: "0px 12px 8px 12px" }}>
                  <UploadImageButton
                    label={t('add_card_button')}
                    onUpload={addLocalCard}
                    width={"72px"} />

                  {Array.from(localCards.values()).map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      editedCards={editedCards} setEditedCards={setEditedCards}
                      isSelected={selectedCards.has(card.id)}
                      onClick={() => handleCardClick(card.id)}
                      isLocalCard={true}
                      updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard}
                      userData={userData}
                    />
                  ))}

                </Grid>
              </TabPanel>
            </ScrollableBox>
          </>
        )
      }

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          padding: "6px 8px 6px 12px",
          gap: 1,
        }}>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenUploadPackDialog(true)}
            sx={{ minWidth: "0 !important", padding: "6px 12px" }}
          >
            <DriveFolderUploadOutlinedIcon sx={{ mr: "6px", ml: "-2px" }} />
            <Typography>
              {t('upload_pack')}
            </Typography>
          </Button>

          <UploadPackDialog
            open={openUploadPackDialog}
            onClose={() => setOpenUploadPackDialog(false)}
            onSubmit={handlePreparePack}
          />

          <ConfirmUploadPackDialog
            open={openConfirmUploadPackDialog}
            onClose={() => setOpenConfirmUploadPackDialog(false)}
            onSubmit={handleConfirmUpload}
            allCards={cardsArr}
            allCategories={categoriesArr}
            allSets={setsArr}
            allBackgrounds={backgroundsArr}

            preparedCards={preparedCards}
            preparedCategories={preparedCategories}
            preparedSets={preparedSets}
            preparedBackgrounds={preparedBackgrounds}
          />


          <Button
            variant="outlined"
            onClick={() => setOpenDataManagerDialog(true)}
            sx={{ minWidth: "0 !important", padding: "6px 12px" }}
          >
            <SettingsIcon sx={{ mr: "6px", ml: "-2px" }} />
            <Typography>
              {t('data_manager')}
            </Typography>
          </Button>

          <DataManagerDialog
            open={openDataManagerDialog}
            onClose={() => setOpenDataManagerDialog(false)}
            localCards={localCards} clearLocalCards={clearLocalCards}
            localCategories={localCategories} clearLocalCategories={clearLocalCategories}
            localSets={localSets} clearLocalSets={clearLocalSets}
            localBackgrounds={localBackgrounds} clearLocalBackgrounds={clearLocalBackgrounds}
          >
          </DataManagerDialog>
        </Box>

        {/* <Typography
              variant="body1"
              component="span"
              color="primary"
              sx={{
                cursor: 'pointer',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onClick={handleClick}
            >
              Licensed under the MIT License.
            </Typography> */}


      </Box>
    </Box >
  );
}

export default SideMenu;

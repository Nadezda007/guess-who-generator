import { useState, useEffect } from "react";

import Header from "./pages/Header";
import SideMenu from "./pages/SideMenu";
import CollapsButton from "./pages/components/CollapsButton";
import SettingsPanel from "./pages/SettingsPanel";
import PreviewArea from "./pages/PreviewArea";

import { useTheme } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import "./App.css";

import DragAndDropOverlay from "./pages/DragAndDropOverlay";

import initialTeams from "./data/initialTeams";
import initialSettings from "./data/initialSettings";

// HOOKS
import useUserData from "./hooks/useUserData";
import useDefaultSettingsProfiles from "./hooks/useDefaultSettingsProfiles";
import useSettingsProfiles from "./hooks/useSettingsProfiles";

import useContentData from "./hooks/useContentData";
import useLocalCards from "./hooks/useLocalCards";
import useLocalCategories from "./hooks/useLocalCategories";
import useLocalSets from "./hooks/useLocalSets";
import useLocalBackgrounds from "./hooks/useLocalBackgrounds";
import AppErrorBoundary from "./AppErrorBoundary";


function App() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /* ------- PUBLIC CONTENT ------- */
  const { cards, categories, sets, backgrounds } = useContentData();

  /* ------- CARDS ------- */
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [editedCards, setEditedCards] = useState({});
  const { localCards, addLocalCard, addMultipleLocalCards, updateLocalCard, deleteLocalCard, clearLocalCards } = useLocalCards();

  /* ------- CATEGORIES ------- */
  const { localCategories, addMultipleLocalCategories, clearLocalCategories } = useLocalCategories();

  /* ------- SETS ------- */
  const { localSets, addMultipleLocalSets, clearLocalSets } = useLocalSets();

  /* ------- BACKGROUNDS ------- */
  const { localBackgrounds, addLocalBackground, addMultipleLocalBackgrounds, deleteLocalBackground, clearLocalBackgrounds } = useLocalBackgrounds();

  /* ------- TEAMS ------- */
  const [teams, setTeams] = useState(initialTeams);

  /* ------- SIDE MENU ------- */
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideMenuTabIndex, setTabIndex] = useState(1);

  /* ------- SIDE MENU CARD SETTINGS------- */
  const [userData, setUserData, isUserDataLoading] = useUserData();

  /* ------- SETTINGS PANEL ------- */
  const [settingsMenuCollapsed, setSettingsMenuCollapsed] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const { defaultSettingsProfiles } = useDefaultSettingsProfiles();
  const { settingsProfiles, addSettingsProfile, updateSettingsProfile, deleteSettingsProfile } = useSettingsProfiles();

  return (
    <AppErrorBoundary>
      <DragAndDropOverlay
        addLocalCard={addLocalCard}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          userSelect: userData.disableInteraction ? "none" : "auto",
        }}
      >
        {/* ------- HEADER ------- */}
        <Header
          settings={settings}
          userData={userData} setUserData={setUserData}
        />

        {/* ------- BODY ------- */}
        <PanelGroup direction="horizontal">
          {/* ------- LEFT PANEL ------- */}
          <Panel
            className={`side-menu ${sideMenuCollapsed ? "collapsed" : ""}`}
            minSize={15}
            defaultSize={27.5}
            maxSize={60}
            style={{
              display: "block",
              overflow: 'hidden',
              maxWidth: sideMenuCollapsed ? '0' : '100vh',
              opacity: sideMenuCollapsed ? 0 : 1,
              transition: 'max-width 0.4s ease, opacity 0.3s ease',
              borderRight: `1px solid ${theme.palette.divider}`
            }}
          >
            {/* ------- SIDE MENU ------- */}
            <SideMenu
              cards={cards} categories={categories} sets={sets}
              selectedCards={selectedCards} setSelectedCards={setSelectedCards}
              editedCards={editedCards} setEditedCards={setEditedCards}
              localCards={localCards} addLocalCard={addLocalCard} addMultipleLocalCards={addMultipleLocalCards} updateLocalCard={updateLocalCard} deleteLocalCard={deleteLocalCard} clearLocalCards={clearLocalCards}
              localCategories={localCategories} addMultipleLocalCategories={addMultipleLocalCategories} clearLocalCategories={clearLocalCategories}
              localSets={localSets} addMultipleLocalSets={addMultipleLocalSets} clearLocalSets={clearLocalSets}
              localBackgrounds={localBackgrounds} addMultipleLocalBackgrounds={addMultipleLocalBackgrounds} clearLocalBackgrounds={clearLocalBackgrounds}
              backgrounds={backgrounds}
              userData={userData} setUserData={setUserData} isUserDataLoading={isUserDataLoading}
              settings={settings} setSettings={setSettings}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              tabIndex={sideMenuTabIndex} setTabIndex={setTabIndex}
            />
          </Panel>

          {/* ------- RESIZE HANDLE ------- */}
          <PanelResizeHandle
            className={isDark ? "panel-resize-handle-right-dark" : "panel-resize-handle-right"}
          />

          {/* ------- CENTER PANEL ------- */}
          <Panel
            className="preview-area"
            minSize={15}
            style={{
              display: "flex",
              // backgroundColor: "red",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
            }}
          >

            {/* ------- SIDE MENU COLLAPS BUTTON ------- */}
            <CollapsButton
              // label={"Cards"}
              collapsed={sideMenuCollapsed}
              setCollapsed={setSideMenuCollapsed}
              sx={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
            />

            {/* ------- PREVIEW AREA ------- */}
            <PreviewArea
              cards={cards}
              selectedCards={selectedCards} setSelectedCards={setSelectedCards}
              editedCards={editedCards}
              localCards={localCards}
              backgrounds={backgrounds} localBackgrounds={localBackgrounds}
              teams={teams} setTeams={setTeams}
              settings={settings}
              userData={userData}
            />

            <CollapsButton
              // label={"Settings"}
              collapsed={settingsMenuCollapsed}
              setCollapsed={setSettingsMenuCollapsed}
              reverse={true}
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 5 }}
            />
          </Panel>

          {/* ------- RESIZE HANDLE ------- */}
          <PanelResizeHandle
            className={isDark ? "panel-resize-handle-left-dark" : "panel-resize-handle-left"}
          />

          {/* ------- RIGHT PANEL ------- */}
          <Panel
            className={`settings-panel ${settingsMenuCollapsed ? "collapsed" : ""}`}
            minSize={15}
            defaultSize={27}
            maxSize={60}
            style={{
              display: "block",
              overflow: 'hidden',
              maxWidth: settingsMenuCollapsed ? '0' : '100vh',
              opacity: settingsMenuCollapsed ? 0 : 1,
              transition: 'max-width 0.4s ease, opacity 0.3s ease',
              borderLeft: `1px solid ${theme.palette.divider}`
            }}
          >

            {/* ------- SETTINGS PANEL ------- */}
            <SettingsPanel
              userData={userData} setUserData={setUserData} isUserDataLoading={isUserDataLoading}
              settings={settings} setSettings={setSettings}
              defaultSettingsProfiles={defaultSettingsProfiles}
              settingsProfiles={settingsProfiles} addSettingsProfile={addSettingsProfile}
              updateSettingsProfile={updateSettingsProfile} deleteSettingsProfile={deleteSettingsProfile}
              backgrounds={backgrounds} localBackgrounds={localBackgrounds}
              addLocalBackground={addLocalBackground} deleteLocalBackground={deleteLocalBackground}
              teams={teams}
            />
          </Panel>
        </PanelGroup>
      </DragAndDropOverlay>
    </AppErrorBoundary>
  );
}

export default App;

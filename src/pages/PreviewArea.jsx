import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import DeselectOutlinedIcon from '@mui/icons-material/DeselectOutlined';

import TeamSettings from "./components/TeamSettings";
import PrintedCard from "./components/PrintedCard";
import PrintedBackCard from "./components/PrintedBackCard";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { paperDefaultScaleFactor } from "../data/constants";


function PreviewArea({
  cards,
  selectedCards, setSelectedCards,
  editedCards,
  localCards,
  backgrounds, localBackgrounds,
  teams, setTeams,
  settings, userData
}) {
  const theme = useTheme();
  const { t } = useTranslation(); // connect i18next

  const errorRef = useRef(0);

  // ZOOM, OFFSET
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const minZoom = 0.2;
  const maxZoom = 10;

  const [sizeError, setSizeError] = useState(false);

  // PAPER SIZE
  const areaRef = useRef(null);
  const paperRef = useRef(null);
  const isPortrait = settings.orientation === "portrait";
  const paperColor = theme.palette.mode === "dark" ? "#222" : "#fff";

  const paperWidth = useMemo(() =>
    paperDefaultScaleFactor * (isPortrait ? settings.paperWidth : settings.paperHeight),
    [settings.paperWidth, settings.paperHeight, isPortrait]
  );
  const paperHeight = useMemo(() =>
    paperDefaultScaleFactor * (isPortrait ? settings.paperHeight : settings.paperWidth),
    [settings.paperWidth, settings.paperHeight, isPortrait]
  );
  const paperPadding = paperDefaultScaleFactor * settings.paperPadding;

  // CARD SIZE
  const cardWidth = useMemo(() =>
    paperDefaultScaleFactor * settings.cardWidth,
    [settings.cardWidth]
  );
  const cardHeight = useMemo(() =>
    paperDefaultScaleFactor * settings.cardHeight,
    [settings.cardHeight]
  );

  // Filter active commands
  const activeTeams = Object.entries(teams).filter(([_, team]) => team.active);

  // Convert Set to array
  const selectedCardsArray = Array.from(selectedCards);

  // Generate an array of cards based on commands
  const cardsToRender = useMemo(() => {
    if (activeTeams.length === 0) return [...selectedCards];

    return activeTeams.flatMap(([teamId, teamSettings]) =>
      selectedCardsArray.map((cardId) => {
        return {
          cardId,
          teamId,
          markFront: teamSettings.markFront,
        };
      })
    );
  }, [selectedCards, activeTeams]);

  // Generate an array of backgrounds (if commands are selected)
  const backsToRender = useMemo(() => {
    if (activeTeams.length === 0) return [];

    return activeTeams.flatMap(([teamId, teamSettings]) =>
      teamSettings.showBacks
        ? selectedCardsArray.map(() => ({ teamId }))
        : []
    );
  }, [selectedCardsArray, activeTeams]);


  // Determine the screen size and calculate the scale
  const getScaleFactor = () => {
    const area = areaRef.current;
    const paper = paperRef.current;

    if (!area || !paper) return 1;

    const windowWidth = area.offsetWidth * 0.9;
    const windowHeight = area.offsetHeight * 0.9;

    const scaleWidth = roundZoom(windowWidth / paper.offsetWidth);
    const scaleHeight = roundZoom(windowHeight / paper.offsetHeight);

    // Select a smaller scale so that the sheet fits on the screen.
    return Math.min(scaleWidth, scaleHeight);
  };


  // Set the standard scale for the first render
  useLayoutEffect(() => {
    setTimeout(() => {
      setZoom(getScaleFactor());
    }, 100);
  }, [settings.orientation]);

  // Interactivity processing
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    // Adding mouse handlers
    area.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Adding touch screen handlers
    area.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      area.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      area.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [offset, dragging]);


  // Touchpad gesture handlers on the computer
  const handleMouseDown = (e) => {
    setDragging(true);
    startPos.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
  };


  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  // Touchpad gesture processors on phones
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return; // Ignore multitouch
    setDragging(true);
    startPos.current = {
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!dragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - startPos.current.x,
      y: e.touches[0].clientY - startPos.current.y,
    });
  };

  const handleTouchEnd = () => setDragging(false);

  // Mouse wheel processors
  const handleWheel = (e) => {
    setZoom((prevZoom) => Math.min(
      maxZoom,
      Math.max(minZoom, prevZoom - e.deltaY * 0.001)
    ));
  };

  // Zoom buttons
  const roundZoom = (zoom) => Math.round(zoom * 10) / 10;
  const handleZoomIn = () => setZoom((prevZoom) =>
    prevZoom > 0.6
      ? Math.min(maxZoom, roundZoom(prevZoom * 1.2))
      : Math.min(maxZoom, roundZoom(prevZoom + 0.1)));
  const handleZoomOut = () => setZoom((prevZoom) =>
    prevZoom > 0.6
      ? Math.max(minZoom, roundZoom(prevZoom / 1.2))
      : Math.max(minZoom, roundZoom(prevZoom - 0.1)));

  // Return to position button
  const handleResetPosition = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(getScaleFactor());
  };

  // Break down cards into pages
  const cardsPerRow = Math.floor((paperWidth - 2 * paperPadding) / (cardWidth + (2 * settings.gridWidth)));
  const rowsPerPage = Math.floor((paperHeight - 2 * paperPadding) / (cardHeight + (2 * settings.gridWidth)));

  useEffect(() => {
    // Error checking
    const cardsPerRow = Math.floor((paperWidth - 2 * paperPadding) / (cardWidth + (2 * settings.gridWidth)));
    const rowsPerPage = Math.floor((paperHeight - 2 * paperPadding) / (cardHeight + (2 * settings.gridWidth)));

    if (cardsPerRow <= 0 || rowsPerPage <= 0) {
      setSizeError(true);
    } else {
      setSizeError(false);
    }
  }, [cardsToRender, backsToRender, paperWidth, paperHeight, paperPadding, cardWidth, cardHeight, settings.gridWidth]);

  // Break down cards into pages
  const pages = useMemo(() => {
    const cardsPerRow = Math.floor((paperWidth - 2 * paperPadding) / cardWidth);
    const rowsPerPage = Math.floor((paperHeight - 2 * paperPadding) / cardHeight);
    const cardsPerPage = cardsPerRow * rowsPerPage;
    if (cardsPerRow <= 0 || rowsPerPage <= 0 || cardsPerPage <= 0) return [];

    const result = [];
    for (let i = 0; i < cardsToRender.length; i += cardsPerPage) {
      result.push(cardsToRender.slice(i, Math.min(i + cardsPerPage, cardsToRender.length)));
    }

    return result;
  }, [cardsToRender, paperWidth, paperHeight, paperPadding, cardWidth, cardHeight]);

  const backsPages = useMemo(() => {
    const cardsPerRow = Math.floor((paperWidth - 2 * paperPadding) / cardWidth);
    const rowsPerPage = Math.floor((paperHeight - 2 * paperPadding) / cardHeight);
    const cardsPerPage = cardsPerRow * rowsPerPage;
    if (cardsPerRow <= 0 || rowsPerPage <= 0 || cardsPerPage <= 0) return [];

    const result = [];
    for (let i = 0; i < backsToRender.length; i += cardsPerPage) {
      result.push(backsToRender.slice(i, Math.min(i + cardsPerPage, backsToRender.length)));
    }

    return result;
  }, [backsToRender, paperWidth, paperHeight, paperPadding, cardWidth, cardHeight]);

  // Determine the number of rows and columns for displaying sheets
  const pagesCount = pages.length + backsPages.length;
  const gridColumns = Math.ceil(Math.sqrt(pagesCount));  // Number of columns = square root of the number of sheets, rounded up
  const gridRows = Math.ceil(pagesCount / gridColumns);   // Number of rows for placing sheets

  return (
    <Box
      ref={areaRef}
      sx={{
        display: "flex",
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
      onWheel={handleWheel}
    >
      {/* Text with the number of selected cards */}
      <Box sx={{
        display: "flex",
        position: "absolute",
        top: 10,
        marginInline: "8px",
        userSelect: "none",
        gap: 1,
        zIndex: 4,
      }}>

        <Box sx={{
          padding: "3px 16px",
          alignContent: "center",
          background: paperColor,
          boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
        }}>
          <Typography variant="h6" >
            {t('selected_count')} {selectedCards.size}
          </Typography>
          {errorRef.current > 0 && (
            <Typography variant="h6" color="red" >
              ({t('errors_count')} {errorRef.current})
            </Typography>
          )}
        </Box>

        <Box sx={{
          padding: "2px",
          alignContent: "center",
          background: paperColor,
          boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
        }}>
          <IconButton
            aria-label="deselect"
            disabled={selectedCards.size === 0}
            onClick={() => setSelectedCards(new Set())}
          >
            <DeselectOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={paperRef}
        sx={{
          display: "grid",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transition: "transform 0.15s ease-out",
          gridTemplateColumns: `repeat(${isPortrait ? gridColumns : gridRows}, 1fr)`,
          gridTemplateRows: `repeat(${isPortrait ? gridRows : gridColumns}, 1fr)`,
          gap: "16px",
        }}
      >

        {/* pagesCount === 0  */}
        {pagesCount === 0 && (
          <Box sx={{
            display: "flex",
            width: `${paperWidth}px`,
            height: `${paperHeight}px`,
            padding: "8px 12px",
            justifyContent: "center",
            alignItems: "center",
            background: paperColor,
            boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.2)",
            borderRadius: "2px",
            userSelect: "none",
          }}
          >
            <Typography
              variant="h4"
              color={sizeError ? theme.palette.error.main : "text.secondary"}>
              {sizeError ? t("size_error") : t("empty_page")}
            </Typography>
          </Box>
        )}


        {pages.map((pageCards, pageIndex) => {
          errorRef.current = 0;

          return (
            <Box // !important box (opacity download)
              key={pageIndex}
              elevation={3}
              sx={{
                backgroundColor: paperColor,
                boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.2)",
                borderRadius: "2px",
              }}
            >
              <Box
                className="paper"
                sx={{
                  display: "grid",
                  width: `${paperWidth}px`,
                  height: `${paperHeight}px`,
                  padding: `${paperPadding}px`,
                  gridTemplateColumns: `repeat(${cardsPerRow}, ${cardWidth}px)`,
                  gridTemplateRows: `repeat(${rowsPerPage}, ${cardHeight}px)`,
                  gap: `${settings.gridWidth}px`,
                }}
              >
                {activeTeams.length === 0 ? (
                  pageCards.map((id, index) => {
                    // Null check
                    const card = localCards.get(id) || cards.get(id);
                    const localCard = localCards.get(id);
                    if (!card && !localCard) {
                      errorRef.current++;
                      return null;
                    }

                    return (
                      <PrintedCard
                        key={index}
                        card={localCard || card}
                        editedCards={editedCards}
                        cardWidth={cardWidth} cardHeight={cardHeight}
                        isLocalCard={localCard ? true : false}
                        backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                        settings={settings}
                        userData={userData}
                      />
                    )
                  })
                ) :
                  (
                    pageCards.map(({ cardId, teamId, markFront }, index) => {
                      // Null check
                      const card = cards.get(cardId);
                      const localCard = localCards.get(cardId);
                      if (!card && !localCard) {
                        errorRef.current++;
                        return null;
                      }

                      return (
                        <PrintedCard
                          key={index}
                          card={localCard || card}
                          editedCards={editedCards}
                          cardWidth={cardWidth} cardHeight={cardHeight}
                          isLocalCard={localCard ? true : false}
                          backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                          team={teams[teamId]} markFront={markFront}
                          settings={settings}
                          userData={userData}
                        />
                      )
                    })
                  )}
              </Box>
            </Box>
          )
        })}

        {backsPages.map((backsPageCards, backsPageIndex) => {
          return (

            <Box // !important box (opacity download)
              key={backsPageIndex}
              elevation={3}
              sx={{
                direction: "rtl",
                backgroundColor: paperColor,
                boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.2)",
                borderRadius: "2px",
                // gap: `${settings.gridWidth}px`,
              }}>
              <Box
                className="paper"
                sx={{
                  display: "grid",
                  width: `${paperWidth}px`,
                  height: `${paperHeight}px`,
                  padding: `${paperPadding}px`,
                  gridTemplateColumns: `repeat(${cardsPerRow}, ${cardWidth}px)`,
                  gridTemplateRows: `repeat(${rowsPerPage}, ${cardHeight}px)`,
                  gap: `${settings.gridWidth}px`,
                }}
              >
                {activeTeams.length === 0 ? (
                  backsPageCards.map((id, index) => {

                    return (
                      <PrintedBackCard
                        key={index}
                        cardWidth={cardWidth} cardHeight={cardHeight}
                        backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                        settings={settings}
                        userData={userData}
                      />
                    )
                  })
                ) : (
                  backsPageCards.map(({ teamId }, index) => {

                    return (
                      <PrintedBackCard
                        key={index}
                        cardWidth={cardWidth} cardHeight={cardHeight}
                        backgrounds={backgrounds} localBackgrounds={localBackgrounds}
                        team={teams[teamId]}
                        settings={settings}
                        userData={userData}
                      />
                    )
                  })
                )}
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          position: "absolute",
          bottom: 8,
          left: 8,
          alignItems: "center",
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.background.default,
          padding: "6px 8px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: theme.palette.primary.main,
        }}
      >
        <TeamSettings
          teams={teams} setTeams={setTeams}
        />
      </Box>

      {/* Zoom buttons and display of current zoom level */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        bottom: 8,
        right: 8,
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignSelf: "end",
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.default,
            padding: "6px 8px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: theme.palette.primary.main,
            marginBottom: "8px",
          }}
        >
          <IconButton onClick={handleResetPosition} color="primary" size="small">
            {/* <CenterFocusStrongOutlinedIcon /> */}
            <CropFreeOutlinedIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.default,
            padding: "6px 8px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: theme.palette.primary.main,
            userSelect: "none",
          }}
        >
          <IconButton onClick={handleZoomOut} color="primary" size="small">
            <ZoomOutIcon />
          </IconButton>
          <Typography minWidth="48px" textAlign="center">{Math.round(zoom * 100)}%</Typography>
          <IconButton onClick={handleZoomIn} color="primary" size="small">
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>
    </Box >
  );
}

export default PreviewArea;

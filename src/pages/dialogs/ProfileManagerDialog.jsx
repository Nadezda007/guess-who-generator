import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';

import ProfileItemRow from "../components/ProfileItemRow";
import ConfirmDeleteProfileDialog from "./ConfirmDeleteProfileDialog";
import EditProfileDialog from "./EditProfileDialog";
import AddSettingsProfileDialog from "./AddSettingsProfileDialog";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import downloadProfileAsJSON from "../../hooks/downloadProfileAsJSON";

import { v4 as uuidv4 } from 'uuid';

const ProfileManagerDialog = ({
    open, onClose,
    settings,
    allProfileList, profileList,
    addSettingsProfile,
    updateSettingsProfile,
    deleteSettingsProfile
}) => {
    const theme = useTheme();
    const { t } = useTranslation(); // connect i18next

    const [addProfileDialogOpen, setAddProfileDialogOpen] = useState(false);
    const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
    const [openDeleteProfileDialog, setOpenDeleteProfileDialog] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    // Swap the order of two profiles
    const swapProfiles = async (profileA, profileB) => {
        if (!profileA || !profileB) return;

        const orderA = profileA.order;
        const orderB = profileB.order;

        await updateSettingsProfile(profileA.id, { order: orderB });
        await updateSettingsProfile(profileB.id, { order: orderA });
    };

    // Move up
    const onMoveUp = async (profile, profileList) => {
        const sorted = [...profileList].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex(p => p.id === profile.id);
        if (index > 0) {
            await swapProfiles(sorted[index], sorted[index - 1]);
        }
    };

    // Move down
    const onMoveDown = async (profile, profileList) => {
        const sorted = [...profileList].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex(p => p.id === profile.id);
        if (index < sorted.length - 1) {
            await swapProfiles(sorted[index], sorted[index + 1]);
        }
    };

    const handleOpenEditDialog = (profile) => {
        setSelectedProfile(profile);
        setOpenEditProfileDialog(true);
    };

    const updateProfileName = async (id, newName) => {
        if (!id || !newName?.trim()) return;

        const updatedProfile = {
            id,
            name: newName.trim(),
        };

        try {
            await updateSettingsProfile(id, updatedProfile);
            console.log(`Profile name with id=${id} updated to "${newName}"`);
        } catch (error) {
            console.error("Error updating profile name:", error);
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setSelectedProfile(id);
        setOpenDeleteProfileDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProfile !== null) {
            deleteSettingsProfile(selectedProfile);

        }
        setOpenDeleteProfileDialog(false);
        setSelectedProfile(null);
    };

    const getUniqueProfileName = (name, profileList) => {
        let newName = name;
        let counter = 1;

        const names = profileList.map(p => p.name);

        while (names.includes(newName)) {
            newName = `${name} (${counter})`;
            counter++;
        }

        return newName;
    };

    const handleImportProfile = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        try {
            // read the file
            const text = await selectedFile.text();
            const importedProfile = JSON.parse(text);

            const uniqueName = getUniqueProfileName(importedProfile.name, profileList);

            // creating a new profile
            const newProfile = {
                ...importedProfile,
                id: uuidv4(),
                name: uniqueName,
                order: profileList.length > 0
                    ? Math.max(...profileList.map(p => p.order ?? 0)) + 1
                    : 0,
            };

            await addSettingsProfile(newProfile);

            console.log("✅ Profile successfully imported:", newProfile);
        } catch (error) {
            console.error("❌ Error loading profile:", error);
        } finally {
            // reset the input value so that the same file can be loaded again
            event.target.value = "";
        }
    };

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

            <DialogTitle display="flex" sx={{ paddingBottom: "8px", justifyContent: "space-between", gap: 1 }}>
                <Typography component="div" variant="h6" sx={{ alignContent: "center" }}>
                    {t('settings_profiles')}
                </Typography>

                <Box>
                    <input
                        type="file"
                        accept="application/json"
                        id="profile-upload"
                        style={{ display: "none" }}
                        onChange={handleImportProfile}
                    />
                    <label htmlFor="profile-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            // color="error"
                            sx={{ alignSelf: "center" }}>
                            {t('upload_json')}
                        </Button>
                    </label>
                </Box>
            </DialogTitle>

            <DialogContent>
                {!profileList?.length > 0 && (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setAddProfileDialogOpen(true)}
                                sx={{ paddingInline: "8px", pt: "6px", pb: "4px" }}
                            >
                                <AddOutlinedIcon sx={{ marginInline: "4px" }} />
                                {t('create_new_profile')}
                            </Button>
                        </Box>

                        <AddSettingsProfileDialog
                            open={addProfileDialogOpen}
                            onClose={() => setAddProfileDialogOpen(false)}
                            settings={settings}
                            profileList={allProfileList}
                            addSettingsProfile={addSettingsProfile}
                        />
                    </>
                )}
                {profileList.map((profile, index) => (
                    <ProfileItemRow
                        key={profile.id || index}
                        text={profile.name}
                        isFirst={index === 0}
                        isLast={index === profileList.length - 1}
                        onMoveUp={() => onMoveUp(profile, profileList)}
                        onMoveDown={() => onMoveDown(profile, profileList)}
                        onEdit={() => handleOpenEditDialog(profile)}
                        onDownload={() => downloadProfileAsJSON(profile)}
                        onDelete={() => handleOpenDeleteDialog(profile.id)}
                    />
                ))}
            </DialogContent>

            {
                selectedProfile && (
                    <EditProfileDialog
                        open={openEditProfileDialog}
                        onClose={() => setOpenEditProfileDialog(false)}
                        profile={selectedProfile}
                        onSave={(id, newName) => updateProfileName(id, newName)}
                    />
                )
            }

            <ConfirmDeleteProfileDialog
                open={openDeleteProfileDialog}
                onClose={() => setOpenDeleteProfileDialog(false)}
                onConfirm={handleConfirmDelete}
                name={profileList.find(p => p.id === selectedProfile)?.name}
            />

            <DialogActions sx={{ padding: "16px 24px", paddingTop: "0px" }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ padding: "6px 14px 4px 14px" }}>
                    {t('button_cancel')}
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default ProfileManagerDialog;

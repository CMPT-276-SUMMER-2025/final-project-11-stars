import Globe from "react-globe.gl";
import type {satellitePositionInterface} from "../../model/interfaces.ts";
import {Alert, Autocomplete, Button, IconButton, TextField, Tooltip} from "@mui/material";
import React, {type RefObject} from "react";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const APIErrorAlert = () => (
    // Alert for when there's some sort of error with the API during fetching/setting data that we can't do anything about.
    // e.g. API server is down
    <Alert severity="error"
           style={{
               // Centers the alert text and icon due to nonstandard height
               display: "flex",
               alignItems: "center"
           }}>
        CELESTRAK API unavailable.
    </Alert>
);

const WaitingForAPIResponseAlert = () => (
    // Alert for when there's some sort of error with the API during fetching/setting data that we can't do anything about.
    // e.g. API server is down
    <Alert severity="info"
           style={{
               // Centers the alert text and icon due to nonstandard height
               display: "flex",
               alignItems: "center"
           }}>
        Waiting on CELESTRAK API...
    </Alert>
);

const satelliteSelectionUI = (
    satellitePositions: satellitePositionInterface[],
    isWaitingForCELESTRAKAPIResponse: boolean,
    internalSelectedSatellite: satellitePositionInterface | null,
    handleSatelliteChange: (newValue: satellitePositionInterface | null) => void
) => {
    // if the api call hasn't completed yet, show the "waiting" info alert
    if (isWaitingForCELESTRAKAPIResponse) {
        return WaitingForAPIResponseAlert();
    }

    // if the api call has completed already, but the data isn't valid, show the error alert
    if (!satellitePositions || satellitePositions.length === 0) {
        return APIErrorAlert();
    }

    // if the data has loaded, and is valid, show the dropdown menu
    return (
        <Autocomplete
            options={satellitePositions}
            getOptionLabel={(satellite) => satellite.name}
            renderInput={(params) =>
                <TextField {...params} label="Search For A Satellite To Center" variant="outlined"/>
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            style={{width: "25rem"}}
            value={internalSelectedSatellite}
            onChange={(_event, newValue) => handleSatelliteChange(newValue)}
        />
    );
};


export const centerGlobeToChosenSatellitePosition = (
    selectedSatelliteForCentering: satellitePositionInterface | null,
    //@ts-ignore - This ignores the typing issue for the useRef, which is a bug from the react-globegl library.
    globeRef: InstanceType<typeof Globe>,
    satellitePositions: satellitePositionInterface[],
    playLongerAnimation: boolean = false, // keep at end of function so that the default value can be used
) => {
    if (selectedSatelliteForCentering != null && selectedSatelliteForCentering.id != null) { // if there's no satellite chosen
        const satellite = satellitePositions.find(s => s.id === selectedSatelliteForCentering.id); // find the satellite's position, if it exists
        if (satellite) {
            // center the globe onto that satellite
            globeRef.current?.pointOfView(
                {
                    // @ts-ignore
                    lat: satellite.lat,
                    // @ts-ignore
                    lng: satellite.lng
                },
                playLongerAnimation ? 250 : 50 // How long the rotation animation should be
                // Certain functions might want to use the long animation timer, as they jump between distant positions,
                // such as when the user selects a new satellite.
                // Otherwise, the function is probably called by the globe auto-update interval, and doesn't need a long animation
            );
        }
    }

}


export const dropdownAndButtonForCenteringSatellite = (
    satellitePositions: satellitePositionInterface[],
    setSelectedSatelliteForCentering: React.Dispatch<React.SetStateAction<satellitePositionInterface | null>>,
    globeRef: RefObject<any>,
    setlockGlobeDueToCenteredSatellite: React.Dispatch<React.SetStateAction<boolean>>,
    isWaitingForCELESTRAKAPIResponse: boolean
) => {
    const [isCurrentlyLockedToSatellite, setisCurrentlyLockedToSatellite] = React.useState<boolean>(false);
    const [internalSelectedSatellite, setinternalSelectedSatellite] = React.useState<satellitePositionInterface | null>(null);

    const deselectAndClearChosenSatellite = () => {
        setlockGlobeDueToCenteredSatellite(false); // unlock the globe
        setisCurrentlyLockedToSatellite(false); // tell the rest of the app that the globe isn't locked
        setinternalSelectedSatellite(null); // clear internal state
        setSelectedSatelliteForCentering(null); // clear external state
        setisCurrentlyLockedToSatellite(false); // unlock setter button
    };

    const changeSatelliteInternalValue = (
        newValue: satellitePositionInterface | null
    ) => {
        if (newValue === null) {
            // handle the user using the built-in "x" to clear the value instead of the dedicated button
            deselectAndClearChosenSatellite() // deselect and unlock the current satellite
        } else if (newValue != internalSelectedSatellite) {
            // if the new value is a valid and different satellite, set it and unlock the globe
            deselectAndClearChosenSatellite(); // deselect and unlock the current satellite
            setinternalSelectedSatellite(newValue); // set to current satellite, wait for user to lock themselves
        }
        // else do nothing - this part should never be reached, but for the if/if else structure is intentionally kept for safety
    };

    const lockToChosenSatellite = () => {
        if (internalSelectedSatellite) {
            setlockGlobeDueToCenteredSatellite(true); // Lock the globe
            setisCurrentlyLockedToSatellite(true);
            setSelectedSatelliteForCentering(internalSelectedSatellite); // Update the globally used variable for the selected satellite
            centerGlobeToChosenSatellitePosition(internalSelectedSatellite, globeRef, satellitePositions, true); // Force a visual update
        }
    };


    return (

        <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "1rem",
            top: 0,
            justifyContent: "center",
            height: "3.5rem",
            pointerEvents: "auto", //Re-enable interaction for this specific section
        }}>
            {satelliteSelectionUI(satellitePositions, isWaitingForCELESTRAKAPIResponse, internalSelectedSatellite, changeSatelliteInternalValue)}
            <Button
                variant="contained"
                // if there isn't a picked satellite OR the satellite is already locked on to, then don't let the user click the button
                disabled={internalSelectedSatellite === null || isCurrentlyLockedToSatellite}
                onClick={() =>
                    lockToChosenSatellite()
                }
                style={{width: "12.5rem"}} // keep width constant with different texts
            >
                {isCurrentlyLockedToSatellite ? "Currently Locked" : "Lock to Satellite"}
            </Button>
            <Button
                variant="contained"
                disabled={internalSelectedSatellite === null} // if there isn't a picked satellite, then don't let the user click the button to avoid re-seting null to null
                onClick={() =>
                    deselectAndClearChosenSatellite()
                }
            >
                Deselect Satellite & Unlock Globe
            </Button>
            <Tooltip
                title={<div>
                    Select a satellite to center the globe on its position.<br/>
                    Click "Lock to Satellite" to center to your chosen satellite, and to automatically follow it
                    through all time changes.<br/>
                    Use "Deselect Satellite & Unlock Globe" to clear the selection and allow for mouse interaction
                    with the globe again.
                </div>}
            >
                <IconButton size="small" sx={{ml: 0.5}}>
                    <InfoOutlineIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        </div>
    )
}



import Globe from "react-globe.gl";
import type {satellitePositionInterface} from "../../../model/interfaces.ts";
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
) => {
    const [internalSelectedSatellite, setinternalSelectedSatellite] = React.useState<satellitePositionInterface | null>(null);

    const handleSatelliteChange = (
        newValue: satellitePositionInterface | null
    ) => {
        setinternalSelectedSatellite(newValue);
        if (newValue === null) {
            // handle the user using the built-in "x" to clear the value instead of the dedicated button
            handleDeselectSatellite()
        }
    };

    const handleLockToSatellite = () => {
        if (internalSelectedSatellite) {
            setlockGlobeDueToCenteredSatellite(true); // Lock the globe
            setSelectedSatelliteForCentering(internalSelectedSatellite); // Update the globally use variable for the selected satellite
            centerGlobeToChosenSatellitePosition(internalSelectedSatellite, globeRef, satellitePositions, true); // Force a visual update
        }
    };

    const handleDeselectSatellite = () => {
        setlockGlobeDueToCenteredSatellite(false);
        setinternalSelectedSatellite(null);
        setSelectedSatelliteForCentering(null);
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

            {!satellitePositions || satellitePositions.length === 0 ? (
                APIErrorAlert()
            ) : (
                <Autocomplete
                    options={satellitePositions}
                    getOptionLabel={(satellite) => satellite.name}
                    renderInput={(params) =>
                        <TextField {...params} label="Search For A Satellite To Center" variant="outlined"/>
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    style={{width: "25rem"}}
                    value={internalSelectedSatellite}
                    onChange={(_event, newValue) => handleSatelliteChange(newValue)} // The underscore means that the variable's existance is required, but that its value isnt read
                />
            )}
            <Button
                variant="contained"
                disabled={internalSelectedSatellite === null} // if there isn't a picked satellite, then don't let the user click the button
                onClick={() =>
                    handleLockToSatellite()
                }
            >
                Lock to Satellite
            </Button>
            <Button
                variant="contained"
                disabled={internalSelectedSatellite === null} // if there isn't a picked satellite, then don't let the user click the button to avoid re-seting null to null
                onClick={() =>
                    handleDeselectSatellite()
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



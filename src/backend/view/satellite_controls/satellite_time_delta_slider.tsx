import {IconButton, Slider, Tooltip} from "@mui/material";
import React from "react";
import dayjs from "dayjs";
import type {satellitePositionInterface, satelliteTLEInterface} from "../../model/interfaces.ts";
import {getPositionsFromTLEArray} from "../../model/satellites.ts";
import {centerGlobeToChosenSatellitePosition} from "./dropdown_and_button_to_center_satellite.tsx";
import Globe from "react-globe.gl";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

const timeDeltaMarks = [
    {value: -10080, label: '-7 days'},
    {value: -8640, label: '-6 days'},
    {value: -7200, label: '-5 days'},
    {value: -5760, label: '-4 days'},
    {value: -4320, label: '-3 days'},
    {value: -2880, label: '-2 days'},
    {value: -1440, label: '-1 day'},
    {value: 0, label: 'Today'},
    {value: 1440, label: '+1 day'},
    {value: 2880, label: '+2 days'},
    {value: 4320, label: '+3 days'},
    {value: 5760, label: '+4 days'},
    {value: 7200, label: '+5 days'},
    {value: 8640, label: '+6 days'},
    {value: 10080, label: '+7 days'},
];


export const calculateNewDateFromHourDelta = (deltaMinutes: number) => {
    const currentDate = dayjs(); // Get current time
    const newDate = currentDate.add(deltaMinutes, "minutes"); // Add time delta
    return newDate.toDate(); // Convert to JS Date object and return
};

const handleChangeSatellitePositionsForNewTime = (
    setsatelliteSeekMinuteOffset: React.Dispatch<React.SetStateAction<number>>,
    newDelta: number, satelliteTLEArray: satelliteTLEInterface[],
    setsatellitePositions: React.Dispatch<React.SetStateAction<satellitePositionInterface[]>>,
    selectedSatelliteForCentering: satellitePositionInterface | null,
    //@ts-ignore - This is a TypeScript vs. react-globegl bug, and can be safely ignored.
    globeRef: InstanceType<typeof Globe>,
    setdisableGlobeInterval: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setdisableGlobeInterval(true) // Temporarily stop the globe from updating on its interval to prevent two rotations happening at the same time, which looks buggy
    setsatelliteSeekMinuteOffset(newDelta); // Update the offset value
    const newTime = calculateNewDateFromHourDelta(newDelta); // Get a new Date object (now + the chosen offset)
    const newPositions = getPositionsFromTLEArray(satelliteTLEArray, newTime); // Get the new positions in lat/lng from the TLE data at the chosen time
    setsatellitePositions(newPositions); // Set the positions right away isntead of waiting for the next 500ms-cycle update
    centerGlobeToChosenSatellitePosition(selectedSatelliteForCentering, globeRef, newPositions, true) // This starts the long 1000ms animation
    // Since this plays the long animation, wait for the duration (1000ms = 1s) to unlock the globe
    setTimeout(() => {
        setdisableGlobeInterval(false);// Let the globe update freely again
    }, 1000);
}

export const satelliteTimeDeltaSlider = (
    satelliteTLEArray: satelliteTLEInterface[],
    setsatellitePositions: React.Dispatch<React.SetStateAction<satellitePositionInterface[]>>,
    setsatelliteSeekMinuteOffset: React.Dispatch<React.SetStateAction<number>>,
    selectedSatelliteForCentering: satellitePositionInterface | null,
    //@ts-ignore - This is a typescript vs. react-globegl bug that can be safely ignored
    globeRef: InstanceType<typeof Globe>,
    setdisableGlobeInterval: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const [internalOffsetValue, setinternalOffsetValue] = React.useState<number>(0); // internal value that doesn't affect the globe object, but can be set internally so the user can see the current state whiel dragging.
    return (
        <div style={{
            position: "absolute", // Absolute to ensure that it displays overtop (z-axis) the rest of the website
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 2, // Standard z-axis is 0 and the dropdown/button container is 1, so setting it to 2 makes it display overtop of the rest of the side content AND the dropdown/button container
            gap: "1rem",
            padding: "1.5rem 0rem 2.5rem 0rem", // Slightly more padding to account for text guttering
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <Tooltip
                    title={
                        <div>
                            Drag the slider up to view the future, current, or past positions of the 100 brightest
                            satellites orbiting the earth. <br/>
                            The range of options is in singular minutes, with a maximum range of 1 week in both
                            directions.
                        </div>
                    }
                >
                    <IconButton size="large">
                        <SubdirectoryArrowRightIcon fontSize="large" sx={{transform: 'rotate(90deg)'}}/>
                        <InfoOutlineIcon fontSize="large"/>
                    </IconButton>
                </Tooltip>
            </div>
            <Slider
                orientation="vertical"
                min={-10080}
                max={10080}
                step={1} // The possible return values are separated by a single full integer. (1, 2, 3, 4, etc.)
                marks={timeDeltaMarks}
                value={internalOffsetValue}
                // Update the delta variable visually only
                onChange={(_event, newDelta) => {
                    setinternalOffsetValue(newDelta)
                }}
                // When the user releases the slider, apply the change
                onChangeCommitted={(_event, newDelta) => {
                    // The underscore means that this is a necessary, but unused, variable.
                    // This is required here as newDelta is the second variable passed to the handler.
                    handleChangeSatellitePositionsForNewTime(setsatelliteSeekMinuteOffset, newDelta, satelliteTLEArray, setsatellitePositions, selectedSatelliteForCentering, globeRef, setdisableGlobeInterval);
                }}
                valueLabelDisplay="auto" // Displays tooltip on hover
                valueLabelFormat={(value) => `${value} hour${value === 1 ? '' : 's'}`} // Formats tooltip to say "+1 hour", "-60 hours", etc.
                style={{height: "100%"}} // Add a slightly larger gap
            />
        </div>
    );
};

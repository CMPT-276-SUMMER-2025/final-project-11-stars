import Globe from "react-globe.gl";
import type {satellitePositionInterface} from "../../model/interfaces.ts";
import {Autocomplete, Button, TextField} from "@mui/material";
import React, {type RefObject} from "react";

const centerSatelliteOnGlobe = (
    satelliteId: string,
    //@ts-ignore - This ignores the typing issue for the useRef, which is a bug from the react-globegl library.
    globeRef: InstanceType<typeof Globe>,
    satellitePositions: satellitePositionInterface[]
) => {
    const satellite = satellitePositions.find(s => s.id === satelliteId);
    if (satellite) {
        globeRef.current?.pointOfView(
            {
                // @ts-ignore
                lat: satellite.lat,
                // @ts-ignore
                lng: satellite.lng,
                altitude: 2
            },
            1000
        );
    }
}

const deduplicateSatelliteNames = (
    satellites: satellitePositionInterface[]
) => {
    const nameCount: Record<string, number> = {};
    const result: typeof satellites = [];

    for (const satellite of satellites) {
        const baseName = satellite.name;
        if (!(baseName in nameCount)) {
            nameCount[baseName] = 1;
            result.push(satellite);
        } else {
            const count = nameCount[baseName]++;
            result.push({
                ...satellite,
                name: `${baseName} (${count})`
            });
        }
    }

    return result;
}
export const dropdownAndButtonForCenteringSatellite = (satellitePositions: satellitePositionInterface[], selectedSatelliteForCenteringID: satellitePositionInterface | null, setSelectedSatelliteForCenteringID: React.Dispatch<React.SetStateAction<satellitePositionInterface | null>>, globeRef: RefObject<any>) => {
    const deduplicatedSatellitePositions = deduplicateSatelliteNames(satellitePositions);

    return (<>
        <div style={{
            position: "absolute",
            width: "60%",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "row",
            zIndex: 1,
            gap: "1rem",
            justifyContent: "center",
            paddingTop: "1rem"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
            }}>
                <Autocomplete
                    options={deduplicatedSatellitePositions}
                    getOptionLabel={(satellite) => satellite.name}
                    renderInput={(params) => (
                        <TextField {...params} label="Search For A Satellite To Center" variant="outlined"/>
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    style={{width: "25rem"}}
                    value={selectedSatelliteForCenteringID}
                    onChange={(_event, newValue) => setSelectedSatelliteForCenteringID(newValue)}
                />

                <Button
                    variant="contained"
                    disabled={selectedSatelliteForCenteringID === null} // if there isn't a picked satellite, then don't let the user click the button
                    onClick={() => {
                        if (selectedSatelliteForCenteringID) {
                            centerSatelliteOnGlobe(selectedSatelliteForCenteringID.id, globeRef, satellitePositions);
                        }
                    }}
                >
                    Center Satellite
                </Button>
            </div>
        </div>
    </>)
}
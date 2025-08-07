import React, {useEffect, useState, useCallback, useRef} from "react";
import Globe from "react-globe.gl";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsOrLaunchDataSidePanelDataInterface,
    satelliteTLEInterface,
    satellitePositionInterface
} from "../../model/interfaces.ts";
import {load100BrightestSatellites, getPositionsFromTLEArray} from "../../model/satellites.ts";
import {calculateNewDateFromHourDelta} from "../satellite_controls/satellite_time_delta_slider.tsx";
import {centerGlobeToChosenSatellitePosition} from "../satellite_controls/dropdown_and_button_to_center_satellite.tsx";

export const GlobeContainer = (
    //@ts-ignore - This ignores the typing issue for the useRef, which is a bug from the react-globegl library.
    globeRef: InstanceType<typeof Globe>,
    basicLaunchDataArray: basicLaunchDataInterface[],
    detailedLaunchDataArray: detailedLaunchDataInterface[],
    setsatelliteTLEArray: React.Dispatch<React.SetStateAction<satelliteTLEInterface[]>>,
    satellitePositions: satellitePositionInterface[], setsatellitePositions: React.Dispatch<React.SetStateAction<satellitePositionInterface[]>>,
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
    satelliteSeekMinuteOffset: number,
    selectedSatelliteForCentering: satellitePositionInterface | null,
    lockGlobeDueToCenteredSatellite: boolean,
    disableGlobeInterval: boolean,
    setisWaitingForCELESTRAKAPIResponse: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 3 / 5,
        height: window.innerHeight
    });
    useEffect(() => {
        // The globe container doesn't accept dynamic sizing such as "60%",
        // so the value needs to be manually re-set every time the user zooms in ad out.
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth * 3 / 5,
                height: window.innerHeight
            });
        };
        // Trigger handleResize every time the user changes the page dimensions(i.e. resizes the page)
        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // if the globe lock state is false, then enable rotation
        // if the globe lock state is true, then disable rotation
        globeRef.current.controls().enableRotate = !lockGlobeDueToCenteredSatellite;
    }, [lockGlobeDueToCenteredSatellite]);

    // Create mutable ref objects to hold the latest offset value for the setInterval renders
    const satelliteSeekMinuteOffsetRef = useRef(satelliteSeekMinuteOffset);
    const selectedSatelliteForCenteringRef = useRef(selectedSatelliteForCentering);
    const disableGlobeIntervalRef = useRef(disableGlobeInterval)

    // Update the ref whenever the states of the used variables (all 3 below) change, which avoids using stale values in the interval
    useEffect(() => {
        satelliteSeekMinuteOffsetRef.current = satelliteSeekMinuteOffset;
    }, [satelliteSeekMinuteOffset]);
    useEffect(() => {
        selectedSatelliteForCenteringRef.current = selectedSatelliteForCentering;
    }, [selectedSatelliteForCentering]);
    useEffect(() => {
        disableGlobeIntervalRef.current = disableGlobeInterval;
    }, [disableGlobeInterval]);


    useEffect(() => {
        (async () => {
            await load100BrightestSatellites().then((data) => {
                setsatelliteTLEArray(data); // satelliteTLEArray state cannot be used in the function after being set due to React scoping.

                // call everything ONCE manually to allow for single-use disabling of the "waiting for celestrak" info alert.
                if (!disableGlobeIntervalRef.current) { // If the interval isn't being 'taken over' by some other function
                    // Use the current/updated values from the refs instead of the states
                    const currentTimeWithOffsetAdded = calculateNewDateFromHourDelta(satelliteSeekMinuteOffsetRef.current);
                    const positions = getPositionsFromTLEArray(data, currentTimeWithOffsetAdded)
                    setisWaitingForCELESTRAKAPIResponse(false);
                    // api call has completed and data has propogated, whether it's valid or not doesn't matter
                    // since errors are accounted for in a different function
                    setsatellitePositions(positions);
                    centerGlobeToChosenSatellitePosition(selectedSatelliteForCenteringRef.current, globeRef, positions)
                }
                // automate the updates every afterward.
                setInterval(() => {
                    if (!disableGlobeIntervalRef.current) { // If the interval isn't being 'taken over' by some other function
                        // Use the current/updated values from the refs instead of the states
                        const currentTimeWithOffsetAdded = calculateNewDateFromHourDelta(satelliteSeekMinuteOffsetRef.current);
                        const positions = getPositionsFromTLEArray(data, currentTimeWithOffsetAdded)
                        setsatellitePositions(positions);
                        centerGlobeToChosenSatellitePosition(selectedSatelliteForCenteringRef.current, globeRef, positions)
                    }
                }, 500) // Particles update every 500ms. This looks good without causing too much system strain.
            });
        })();
    }, []);

    return (
        <div style={{userSelect: "none", MozUserSelect: "none", pointerEvents: "auto"}}>
            <Globe
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                pointsData={basicLaunchDataArray}
                pointAltitude={() => 0.01}
                pointColor={() => 'red'}
                pointRadius={1}
                onPointClick={(point) => {
                    // @ts-ignore - TS  believes that there does not/might not exist an id for every point, which is incorrect.
                    const pointID = point.id;
                    const matchingDetailedLaunchDataObject = detailedLaunchDataArray.find(
                        (detailedObject) => detailedObject.id === pointID
                    );
                    if (matchingDetailedLaunchDataObject) {
                        setnewsOrLaunchDataSidePanelData({
                            contentType: "launchDetails",
                            content: matchingDetailedLaunchDataObject
                        });
                    } else {
                        throw new Error("error: no detailed launch info found for id:", pointID);
                    }
                }}
                particlesData={[satellitePositions]} // particlesData expects a nested array: [[{lat: ..., lng: ..., ...}]]
                // Acessor names to compare to the passed json file
                // e.g. 'particleLabel: "name_of_thing"' matches "SATELLITE" in {name_of_thing: "SATELLITE", lat: 1, lng: 1}
                particleLabel="name"
                particleLat="lat"
                particleLng="lng"
                particleAltitude="alt"
                // Particle size and color never change, so they never need to be updated and can be set in the Globe object directly instead of using acessor strings.
                particlesSize={1}
                particlesColor={useCallback(() => 'palegreen', [])}
            />
        </div>
    );
};
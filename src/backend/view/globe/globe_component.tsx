import React, {useEffect, useState, useCallback} from "react";
import Globe from "react-globe.gl";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsOrLaunchDataSidePanelDataInterface,
    satelliteTLEInterface,
    satellitePositionInterface
} from "../../model/interfaces.ts";
import {load100BrightestSatellites, getPositionsFromTLEArray} from "../../model/satellites.ts";

export const GlobeContainer = (
    //@ts-ignore - This ignores the typing issue for the useRef, which is a bug from the react-globegl library.
    globeRef: InstanceType<typeof Globe>,
    basicLaunchDataArray: basicLaunchDataInterface[],
    detailedLaunchDataArray: detailedLaunchDataInterface[],
    _satelliteTLEArray: satelliteTLEInterface[], setsatelliteTLEArray: React.Dispatch<React.SetStateAction<satelliteTLEInterface[]>>,
    satellitePositions: satellitePositionInterface[], setsatellitePositions: React.Dispatch<React.SetStateAction<satellitePositionInterface[]>>,
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
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
        (async () => {
            await load100BrightestSatellites().then((data) => {
                setsatelliteTLEArray(data); // satelliteTLEArray state cannot be used in the function after being set due to React scoping.
                setInterval(() => {
                    const now = new Date();
                    const positions = getPositionsFromTLEArray(data, now).map((p: {
                        lat: any;
                        lng: any;
                        altitudeKm: number;
                        id: any;
                        name: any;
                    }) => ({
                        lat: p.lat,
                        lng: p.lng,
                        alt: p.altitudeKm / 6371, // This normalizes the altitude to match the globe radius
                        id: p.id,
                        name: p.name
                    }));
                    setsatellitePositions(positions);
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
                    // @ts-ignore
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
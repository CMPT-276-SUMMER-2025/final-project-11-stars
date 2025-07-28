import React, {useEffect, useState, useRef, useCallback} from "react";
import Globe from "react-globe.gl";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsOrLaunchDataSidePanelDataInterface,
    satelliteTLEInterface
} from "../../model/interfaces.ts";
//@ts-ignore
import {load100BrightestSatellites, getPositionsFromTLEArray} from "../../model/satellites.ts";

export const GlobeContainer = (
    basicLaunchDataArray: basicLaunchDataInterface[],
    detailedLaunchDataArray: detailedLaunchDataInterface[],
    _satelliteTLEArray: satelliteTLEInterface[], setsatelliteTLEArray: React.Dispatch<React.SetStateAction<satelliteTLEInterface[]>>,
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
) => {
    // @ts-ignore
    const globeEl = useRef<InstanceType<typeof Globe>>(null);

    const basicLaunchDataArrayClone = [...basicLaunchDataArray];
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 3 / 5,
        height: window.innerHeight
    });

    //@ts-ignore
    type SatellitePosition = {
        lat: number;
        lng: number;
        alt: number;
        id: string;
        name: string;
    };

    const [satellitePositions, setSatellitePositions] = useState<SatellitePosition[][]>([]);

    // Fix resizing
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth * 3 / 5,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        (async () => {
            await load100BrightestSatellites().then((data) => {
                setsatelliteTLEArray(data); // Not updated in-function so have to work off of local data
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
                        alt: p.altitudeKm / 6371, // normalize altitude to globe radius
                        id: p.id,
                        name: p.name
                    }));
                    // NESTED ARRAY HAHAHAHAHAHAH
                    setSatellitePositions([positions]);
                }, 500) // 500 looks good enough without causing lag
            });
        })();
    }, []);


    return (
        <div style={{userSelect: "none", MozUserSelect: "none", pointerEvents: "auto"}}>
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                pointsData={basicLaunchDataArrayClone}
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
                // WARNING: PARTICLESDATA EXPECTS A NESTED ARRAY (??? WHY ???)
                particlesData={satellitePositions}
                particleLabel="name"
                particleLat="lat"
                particleLng="lng"
                particleAltitude="alt"
                particlesSize={() => 1}
                particlesColor={useCallback(() => 'palegreen', [])}
            />
        </div>
    );
};
import React, {useEffect, useState} from "react";
import Globe from "react-globe.gl";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../../model/interfaces.ts";

export const GlobeContainer = (basicLaunchDataArray: basicLaunchDataInterface[], detailedLaunchDataArray: detailedLaunchDataInterface[], setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>) => {
    const basicLaunchDataArrayClone = [...basicLaunchDataArray] // data is cloned to prevent any mutation-related issues TODO - might be able to delete, test first
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 3 / 5,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth * 3 / 5,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
    }, []);
    return (

        <div style={{
            // Fix for the globe being interpreted by the browser as a draggable image
            userSelect: "none",
            MozUserSelect: "none",
            pointerEvents: "auto"
        }}>
            <Globe
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                pointsData={basicLaunchDataArrayClone}
                pointAltitude={0.02}
                pointColor={() => 'red'}
                pointRadius={0.5}
                onPointClick={(point) => {
                    // Fix for IDE/linter rroneously assuming that point does not have an "id" member
                    // @ts-ignore
                    const pointID = point.id;
                    const matchingDetailedLaunchDataObject = detailedLaunchDataArray.find((detailedObject) => (detailedObject.id === pointID));
                    if (matchingDetailedLaunchDataObject) {
                        setnewsOrLaunchDataSidePanelData({
                            contentType: "launchDetails",
                            content: matchingDetailedLaunchDataObject
                        })
                    } else {
                        console.log("error: no detailed launch info found for id:", pointID);
                        //todo - display this to the user isntead of console logging it
                    }
                }}
            />
        </div>
    );
};
import {useEffect, useState} from "react";
import Globe from "react-globe.gl";
import type {basicLaunchDataInterface} from "../model/interfaces.ts";

export const GlobeContainer = ({ basicLaunchData }: { basicLaunchData: basicLaunchDataInterface[] }) => {
    const basicLaunchDataClone = [...basicLaunchData] // data is cloned to prevent any mutation-related issues
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
        <div>
            <Globe
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                pointsData={basicLaunchDataClone}
                pointAltitude={0.02}
                pointColor={() => 'red'}
                pointRadius={0.5}
                onPointClick={() => {
                    console.log("test");
                }}
            />
        </div>
    );
};
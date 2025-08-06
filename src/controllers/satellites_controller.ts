import type { satelliteTLEInterface } from '../model/interfaces.ts';
import {
    getPositionsFromTLEArray,
    getSatellitePositionAtTime,
    load100BrightestSatellites,
} from '../model/satellites.ts';


const getSatellitesAsTLEArray = () => {
    return load100BrightestSatellites();
}

const getPositionsArrayFromTLEArray = (tleArray : satelliteTLEInterface[], time : Date) => {
    return getPositionsFromTLEArray(tleArray, time);
}

const getSatellitePosition = (tle1 : string, tl2 : string, time : Date) => {
    return getSatellitePositionAtTime(tle1, tl2, time);
}

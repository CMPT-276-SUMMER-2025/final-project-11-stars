import axios from "axios";
import type {satellitePositionInterface, satelliteTLEInterface} from "./interfaces.ts";
import * as satellite from "satellite.js";

// TLE is just a specifically formatted string of data that holds orbital information, it allows people to estimate past/future positions of anything orbiting the earth.
// The TLE will be translated into longitude and latitude by getSatellitePositionAtTime.
export function parseRawTLEStringIntoTLEObjectArray(
    rawTLEString: string
): satelliteTLEInterface[] {
    const lines = rawTLEString.trim().split(/\r?\n/); // Regex to split the raw string at tabs or newlines.
    const parsedTLEObjectArray: satelliteTLEInterface[] = [];

    for (let i = 0; i + 2 < lines.length; i += 3) {
        const name = lines[i].trim(); // Get the satellite name from the TLE
        const line1 = lines[i + 1].trim(); // Line 1 contains identification, epoch timestamp, and drag-related data for the satellite. TL;DR: Non-positional data.
        const line2 = lines[i + 2].trim(); // Line 2 contains the satellite's orbital elements, including inclination, eccentricity, and mean motion. TL;DR: Positional data
        parsedTLEObjectArray.push({name: name, line1: line1, line2: line2});
    }
    return parsedTLEObjectArray;
}

export const load100BrightestSatellites = async (): Promise<satelliteTLEInterface[]> => {
    const CELESTRAK_URL = "https://www.celestrak.com/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle";
    let parsedTLEObjectArray: satelliteTLEInterface[];
    const response = await axios.get(CELESTRAK_URL);

    parsedTLEObjectArray = parseRawTLEStringIntoTLEObjectArray(response.data); // Parses the data, since the response is a row string.
    return parsedTLEObjectArray;
};

export const getSatellitePositionAtTime = (
    tle1: string,
    tle2: string,
    time: Date
) => {
    try {
        const satrec = satellite.twoline2satrec(tle1, tle2);
        const positionAndVelocity = satellite.propagate(satrec, time); // Get position of the satellite at the given time

        if (positionAndVelocity != null && positionAndVelocity.position) {
            const gmst = satellite.gstime(time); // Calculate Earth's rotation
            // Geodetic refers to the data being in relation to to the earth
            const geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst); // Convert position to latitude, longitude and latitude
            let positionObject = {
                lat: satellite.degreesLat(geodetic.latitude), // Convert latitude to degrees
                lng: satellite.degreesLong(geodetic.longitude), // Convert longitude to degrees
                alt: geodetic.height, // Altitude in kilometers
            };
            // invalid lte(s) will result in the calculated values being NaN
            if (Number.isNaN(positionObject.lat) || Number.isNaN(positionObject.lng || Number.isNaN(positionObject.alt))) {
                return null;
            } else {
                // If position couldn't be calculated, drop the entry. This will cause GlobeGL to just ignore this satellite and not render it.
                return positionObject;
            }
        } else {
            return null;
        }
    } catch {
        return null; // Safety net - shouldn't really need to be used unless the calculations somehow return garbage data.
    }
};

export const deduplicateSatelliteNamesAndIDs = (
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
                name: `${baseName} (${count})`,
                id: `${baseName}_${count}`
            });
        }
    }
    return result;
}

export const getPositionsFromTLEArray = (
    tleArray: satelliteTLEInterface[],
    time: Date
) => {
    // Map each satellite TLE to a position object or null if unavailable
    const positionsOrNull = tleArray.map((satellite) => {
        const position = getSatellitePositionAtTime(satellite.line1, satellite.line2, time);

        if (!position) {
            // Can't compute position for this satellite -> set to null.
            // This is filtered out before the getPositionsFromTLEArray return.
            return null;
        }
        return {
            ...position,
            alt: position.alt / 6371, // This normalizes the altitude to match the globe radius
            id: satellite.name,
            name: satellite.name,
        };
    });


    // Filter out all nulls
    const nullFilteredPositions = positionsOrNull.filter(pos => pos !== null);
    // De-duplicate names and IDs
    return deduplicateSatelliteNamesAndIDs(nullFilteredPositions);
};
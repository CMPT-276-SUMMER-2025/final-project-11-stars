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

export const load100BrightestSatellites = async (isCalledForTesting: boolean = false): Promise<satelliteTLEInterface[]> => {
    // "isCalledForTesting" is an optional boolean that defaults to false
    // it is used to account for the fact that this function is called
    // from both the user-facing code (real api) and testing code (hardcoded data, due to celestrak not having a dev API)
    let response; // holds response data
    let parsedTLEObjectArray: satelliteTLEInterface[]; // holds parsed data
    // hardcoded data of 5 satellites to work around celestrak not having a dev api, with 1 duplicate name/id to test the deduplication features (duplicates get renamed/re-id'd to "name/id (#)")
    const CELESTRAK_TESTING_DATA = {
        data:
            "ATLAS CENTAUR 2         \n" +
            "1 00694U 63047A   25216.63745856  .00001149  00000+0  12884-3 0  9999\n" +
            "2 00694  30.3578 327.5908 0552257 329.0620  27.8521 14.10941266100931\n" +
            "SL-3 R/B                \n" +
            "1 00877U 64053B   25216.46293113  .00000143  00000+0  52601-4 0  9990\n" +
            "2 00877  65.0755 247.9479 0059808   8.0355 352.1688 14.61114284235055\n" +
            "SL-8 R/B                \n" +
            "1 02802U 67045B   25216.47031845  .00000287  00000+0  87202-4 0  9991\n" +
            "2 02802  74.0111  33.6868 0063512  93.4812 267.3613 14.45401624 57636\n" +
            "SL-8 R/B                \n" +
            "1 03230U 68040B   25216.54811062  .00002427  00000+0  19041-3 0  9991\n" +
            "2 03230  74.0314  36.7049 0026293 273.8528  85.9654 15.01330052 57408\n" +
            "OAO 2                   \n" +
            "1 03597U 68110A   25216.59730520  .00000219  00000+0  64346-4 0  9995\n" +
            "2 03597  34.9944  37.1358 0006304 259.0695 100.9287 14.47137957987666\n"
    };
    const CELESTRAK_API_URL = "https://www.celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle";
    if (isCalledForTesting) {
        // if called for testing, use hardcoded data to avoid an extra API call
        response = CELESTRAK_TESTING_DATA;
    } else {
        // else (for user-facing purposes) use the real API
        response = await axios.get(CELESTRAK_API_URL);
    }

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
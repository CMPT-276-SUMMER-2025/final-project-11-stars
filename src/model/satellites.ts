// @ts-ignore
import axios from "axios";
import type {satelliteTLEInterface} from "./interfaces.ts";
import * as satellite from "satellite.js";
import celestrakExampleJSON from "../example-jsons/celestrak.json"

const isDevMode = import.meta.env.VITE_CUSTOM_DEV_MODE === "true";

// TLE is just a specifically formatted string of data that holds orbital information, it allows people to estimate past/future positions of anything orbiting the earth.
// The TLE will be translated into longitude and latitude by getSatellitePositionAtTime.
export function parseRawTLEStringIntoTLEObjectArray(
    rawTLEString: string
): satelliteTLEInterface[] {
    const lines = rawTLEString.trim().split(/\r?\n/);
    const parsedTLEObjectArray: satelliteTLEInterface[] = [];

    for (let i = 0; i + 2 < lines.length; i += 3) {
        const name = lines[i].trim();
        const line1 = lines[i + 1].trim();
        const line2 = lines[i + 2].trim();

        if (
            (line1.startsWith("1 ") || line1.startsWith("1")) &&
            (line2.startsWith("2 ") || line2.startsWith("2"))
        ) {
            parsedTLEObjectArray.push({name: name, line1: line1, line2: line2});
        } else {
            throw new Error(`Malformed TLE entry at lines, ${i}\n${i + 1}\n${i + 2}`);
        }
    }
    return parsedTLEObjectArray;
}

export const load100BrightestSatellites = async (): Promise<satelliteTLEInterface[]> => {
    const CELESTRAK_URL = "https://www.celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle";
    const exampleDataFromJSON = celestrakExampleJSON[0].data;
    if (isDevMode) {
        // If we're in dev mode, skip calling the real API.
        console.log("devmode!")
        return parseRawTLEStringIntoTLEObjectArray(exampleDataFromJSON);
    } else {
        let parsedTLEObjectArray: satelliteTLEInterface[];
        try {
            const response = await axios.get(CELESTRAK_URL);
            parsedTLEObjectArray = parseRawTLEStringIntoTLEObjectArray(response.data);
        } catch (error) {
            // Use Example Data from JSON file in case of API error since no backup API exists.
            // TODO - Notify the user that the backup example data is being used instead of the API
            console.warn("Failed to load from API. Falling back to example data.", error);
            parsedTLEObjectArray = parseRawTLEStringIntoTLEObjectArray(exampleDataFromJSON);
        }
        return parsedTLEObjectArray;
    }
};

export const getSatellitePositionAtTime = (
    tle1: string,
    tle2: string,
    time: Date
) => {
    try {
        const satrec = satellite.twoline2satrec(tle1, tle2);
        const positionAndVelocity = satellite.propagate(satrec, time);

        if (positionAndVelocity != null && positionAndVelocity.position) {
            const gmst = satellite.gstime(time);
            const geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
            return {
                lat: satellite.degreesLat(geodetic.latitude),
                lng: satellite.degreesLong(geodetic.longitude),
                altitudeKm: geodetic.height,
            };
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export const getPositionsFromTLEArray = (
    tleArray: satelliteTLEInterface[],
    time: Date
) => {
    // Map each satellite TLE to a position object or null if unavailable
    const positionsOrNull = tleArray.map((satellite) => {
        const position = getSatellitePositionAtTime(satellite.line1, satellite.line2, time);

        if (!position) {
            // Could not compute position for this satellite -> set to null.
            // This is filtered out before the getPositionsFromTLEArray return.
            return null;
        }

        return {
            ...position,
            id: satellite.name,
            name: satellite.name,
        };
    });

    // Filter out all nulls
    return positionsOrNull.filter(pos => pos !== null);
};


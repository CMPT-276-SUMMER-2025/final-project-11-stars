// @ts-ignore
import axios from "axios";
import type {satelliteTLEInterface} from "./interfaces.ts";
import * as satellite from "satellite.js";
import celestrak from "../../example-jsons/celestrak.json"

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
    /*
    const CELESTRAK_URL = "https://www.celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle";
    try {
        const response = await axios.get(CELESTRAK_URL);
        if (response.status !== 200) {
            console.error("Celestrak did not send an HTTP 200 code.");
        }
        const parsedTLEObjectArray = parseRawTLEStringIntoTLEObjectArray(
            response.data
        );
        } catch (error) {
        console.error("Error fetching launches", error);
    }
     */
    // USE JSON DATA TO AVOID GETTING IP BANNED LOL
    return parseRawTLEStringIntoTLEObjectArray(celestrak[0].data);
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


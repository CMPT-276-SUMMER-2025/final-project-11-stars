import axios from 'axios';
import type {basicLaunchDataInterface, detailedLaunchDataInterface} from './interfaces.ts';
import {Dayjs as type_dayjs} from "dayjs";
import React from "react";
import {loadLaunchesOverTimePeriod} from "../controllers/launches_controller.ts";

const isDevMode = import.meta.env.VITE_CUSTOM_DEV_MODE === "true";

/**
 * Handles business logic and access to data in relation to orbital launches.
 */


let detailedLaunchDataArray: detailedLaunchDataInterface[];

/**
 * This method is expected to be called before any other method in this module.
 * @param startDate Expected to be ISO 8601 format.
 * @param endDate Expected to be ISO 8601 format.
 */
const loadLaunchesOverTime = async (startDate: string, endDate: string) => {
    const REAL_LAUNCHES_URL = `https://ll.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`;
    const BACKUP_LAUNCHES_URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`;
    let response;

    if (isDevMode) {
        // If we're in dev mode, skip calling the real API.
        response = await axios.get(BACKUP_LAUNCHES_URL);
    } else {
        try {
            response = await axios.get(REAL_LAUNCHES_URL);
        } catch (error) {
            console.warn("Failed to load from LL2 Launches API. Falling back to dev/backup API.", error);
            response = await axios.get(BACKUP_LAUNCHES_URL);
        }
    }
    detailedLaunchDataArray = response.data.results.map((launch: any) => {
        // If any data doesn't exist, set it to null
        let launchServiceProvider = launch?.launch_service_provider ?? null;
        let launchRocketConfig = launch?.rocket?.configuration ?? null;
        return {
            id: launch?.id ?? null,
            launchName: launch?.name ?? null,
            imageURL: launch?.image?.image_url ?? null,
            launchStatus: launch?.status?.abbrev ?? null,
            launchDate: launch?.window_start == null ? "Not Launched Yet" : launch.window_start,

            location: launch?.pad ? {
                longitude: launch.pad.longitude ?? null,
                latitude: launch.pad.latitude ?? null
            } : null,

            pad: launch?.pad ? {
                name: launch.pad.name ?? null,
                image: launch.pad.image?.image_url ?? null
            } : null,

            agency: launchServiceProvider ? {
                name: launchServiceProvider.name ?? null,
                description: launchServiceProvider.description ?? null,
                logo: launchServiceProvider.logo?.image_url ?? null,
                link: launchServiceProvider.info_url ?? null
            } : null,

            launcherConfiguration: launchRocketConfig ? {
                name: launchRocketConfig.full_name ?? null,
                image: launchRocketConfig.image?.image_url ?? null,
                infoURL: launchRocketConfig.info_url ?? null,
                wikiURL: launchRocketConfig.wiki_url ?? null,

                totalSuccessfulLaunches: launchRocketConfig.successful_launches ?? null,
                totalLaunches: launchRocketConfig.total_launch_count ?? null,

                height: launchRocketConfig.length ?? null,
                diameter: launchRocketConfig.diameter ?? null,
                launchMass: launchRocketConfig.launch_mass ?? null,
                launchCost: launchRocketConfig.launch_cost ?? null,

                isReusable: launchRocketConfig.reusable ?? null,

                manufacturer: launchRocketConfig.manufacturer?.name ?? null
            } : null
        };
    })
    return setFieldsWithNoDataToNull(detailedLaunchDataArray);
}

const getLaunchesAsList = () => {
    return detailedLaunchDataArray;
}

/**
 * Traverses all fields of the object, if any field is ('Unknown' or empty string or empty array), then set it to null,
 * if the field itself refers to an object, then check that object for 'Unknown'/empty string/empty array fields.
 * NOTE: This function is dependent on the Launch Library 2 /launches endpoint. May not work for other objects.
 */
const setFieldsWithNoDataToNull = (launchObject: any) => { //todo - set typing. maybe detailedLaunchDataInterface?

    let invalidPrimitives = [
        "Unknown", undefined, ""
    ]

    for (let key in launchObject) {
        if (launchObject.hasOwnProperty(key)) {
            if (Array.isArray(launchObject[key])) {
                // if field if an array
                if (launchObject[key].length == 0) {
                    launchObject[key] = null;
                }

            } else if (typeof launchObject[key] === "object") {
                // if field is an object
                setFieldsWithNoDataToNull(launchObject[key])

            } else if (invalidPrimitives.includes(launchObject[key])) {
                // field is a primitive
                launchObject[key] = null;
            }
        }
    }
    return launchObject;
}

function extractBasicLaunchDataFromDetailedLaunchData(
    detailed: detailedLaunchDataInterface[]
): basicLaunchDataInterface[] {
    return detailed.map(({id, location, launchName}) => ({
        id: id,
        name: launchName.split(" |")[0], // shortens the name for display. no error handling needed - if there isn't a pipe, split just returns the complete string at index 0
        lng: location.longitude,
        lat: location.latitude
    }));
}

const setLaunchData = async (
    launchSearchStartDate: type_dayjs,
    launchSearchEndDate: type_dayjs,
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    setdetailedLaunchData: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>
) => {
    // Convert dayjs objects to ISO8601 date strings
    const ISOStartDate = launchSearchStartDate.toISOString();
    const ISOEndDate = launchSearchEndDate.toISOString();
    // Make launches API call with date range parameters and set detailed data (parsed to cut out unimportant data, but not mutated)
    const newDetailedLaunchData = await loadLaunchesOverTimePeriod(ISOStartDate, ISOEndDate); //
    setdetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
    // Extract and set basic data relevent for globe display (not mutated either)
    const newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]); //
    setbasicLaunchData(newBasicLaunchData);
}

export {
    loadLaunchesOverTime,
    getLaunchesAsList,
    setFieldsWithNoDataToNull,
    extractBasicLaunchDataFromDetailedLaunchData,
    setLaunchData
}
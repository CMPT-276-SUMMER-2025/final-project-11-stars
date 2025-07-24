import axios from 'axios';
import type {basicLaunchDataInterface, detailedLaunchDataInterface} from './interfaces.ts';
import {Dayjs as type_dayjs} from "dayjs";
import React from "react";
import {loadLaunchesOverTimePeriod} from "../controllers/launches_controller.ts";

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
    const LAUNCHES_URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`;
    try {
        let response = await axios.get(LAUNCHES_URL)

        detailedLaunchDataArray = response.data.results.map((launch: any) => { //todo - figure out typing for launch variable because auto-typing might not work properly.
            let launchServiceProvider = launch.launch_service_provider;
            let launchRocketConfig = launch.rocket.configuration;

            let launchObject = {
                id: launch.id,
                launchName: launch.name,
                imageURL: launch.image.image_url,
                launchStatus: launch.status.abbrev,
                launchDate: (launch.window_start == null) ? "Not Launched Yet" : launch.window_start,

                // launch location is just location of pad
                location: {
                    longitude: launch.pad.longitude,
                    latitude: launch.pad.latitude
                },

                pad: {
                    name: launch.pad.name,
                    image: launch.pad.image.image_url
                },

                agency: {
                    name: launchServiceProvider.name,
                    description: launchServiceProvider.description,
                    logo: launchServiceProvider.logo.image_url,
                    link: launchServiceProvider.info_url
                },

                launcherConfiguration: {
                    name: launchRocketConfig.full_name,
                    image: launchRocketConfig.image.image_url,
                    infoURL: launchRocketConfig.info_url,
                    wikiURL: launchRocketConfig.wiki_url,

                    totalSuccessfulLaunches: launchRocketConfig.successful_launches,
                    totalLaunches: launchRocketConfig.total_launch_count,

                    height: launchRocketConfig.length,
                    diameter: launchRocketConfig.diameter,
                    launchMass: launchRocketConfig.launch_mass,
                    launchCost: launchRocketConfig.launch_cost,

                    isReusable: launchRocketConfig.reusable,

                    manufacturer: launchRocketConfig.manufacturer.name
                }
            };
            /*
            // TODO - fix setFieldsWithNoDataToNull - currently sets filteredLaunchObject to nested arrays with nothing in them
            const filteredLaunchObject = setFieldsWithNoDataToNull(detailedLaunchDataArray);
            console.log(filteredLaunchObject);
            return filteredLaunchObject;
            */
            return launchObject;
        });
        return detailedLaunchDataArray;

    } catch (error) {
        console.error('Error fetching launches', error);
    }
}

const getLaunchesAsList = () => {
    return detailedLaunchDataArray;
}

/**
 * @returns Null if launch is not found.
 */
const getLaunchById = (launchId: string) => {
    for (let launch of detailedLaunchDataArray) {
        if (launchId == launch.id) {
            return launch;
        }
    }
    return null;
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
    const ISOStartDate = launchSearchStartDate.toISOString();
    const ISOEndDate = launchSearchEndDate.toISOString();
    try {
        const newDetailedLaunchData = await loadLaunchesOverTimePeriod(ISOStartDate, ISOEndDate);
        setdetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
        console.log("handleClickSubmitButton, newDetailedLaunchData: ", newDetailedLaunchData) //todo - remove when done testing
        const newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
        console.log("handleClickSubmitButton, newBasicLaunchData: ", newBasicLaunchData) //todo - remove when done testing
        setbasicLaunchData(newBasicLaunchData);
    } catch (error) {
        console.log("error getting/setting new launch data", error);
    }
}

export {
    loadLaunchesOverTime,
    getLaunchesAsList,
    getLaunchById,
    setFieldsWithNoDataToNull,
    extractBasicLaunchDataFromDetailedLaunchData,
    setLaunchData
}
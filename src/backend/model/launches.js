import axios from 'axios';

/**
 * Handles business logic and access to data in relation to orbital launches.
 */


let launches = [];

/**
 * This method is expected to be called before any other method in this module.
 * @param startDate Expected to be ISO 8601 format. 
 * @param endDate Expected to be ISO 8601 format.
 */
const loadLaunchesOverTime = async (startDate, endDate) => {
    const LAUNCHES_URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`;
    try {
        let response = await axios.get(LAUNCHES_URL)

        // launches with missing info will not be included
        launches = response.data.results.map(launch => {

            let launchProvider = launch.launch_service_provider;
            let launchConfig = launch.rocket.configuration;

            let launchObject = {
                id: launch.id,
                launchName: launch.name,
                imageURL : launch.image.image_url,
                launchStatus : launch.status.abbrev,
                launchDate : (launch.window_start == null) ? "Not Launched Yet" : launch.window_start,
                
                // launch location is just location of pad
                location : {
                    longitude : launch.pad.longitude,
                    latitude : launch.pad.latitude
                },

                pad : {
                    name : launch.pad.name,
                    image : launch.pad.image.image_url
                },
                agency : {
                    name : launchProvider.name,
                    description : launchProvider.description,
                    logo : launchProvider.logo.image_url,
                    link : launchProvider.info_url
                },
                launcherConfiguration : {
                    name : launchConfig.full_name,
                    image : launchConfig.image.image_url,
                    infoURL : launchConfig.info_url,
                    wikiURL : launchConfig.wiki_url,

                    totalSuccessfulLaunches : launchConfig.successful_launches,
                    totalLaunches : launchConfig.total_launch_count,

                    height : launchConfig.length,
                    diameter : launchConfig.diameter,
                    launchMass : launchConfig.launch_mass,
                    launchCost : launchConfig.launch_cost,

                    isReusable : launchConfig.reusable,

                    manufacturer : launchConfig.manufacturer.name
                }

            };
            launchObject = setFieldsWithNoDataToNull(launches);
            return launchObject; 
        });


    } catch(error) {
        console.error('Error fetching launches', error);
    }
}

const getLaunchesAsList = () => {
    return launches;
}

/**
 * @returns Null if launch is not found.
 */
const getLaunchById = (launchId) => {
    for(let launch of launches) {
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
const setFieldsWithNoDataToNull = (launchObject) => {

    let invalidPrimitives = [
        "Unknown", undefined, ""
    ]

    for (let key in launchObject) {
        if(launchObject.hasOwnProperty(key)) {
            if(Array.isArray(launchObject[key])) {
                // if field if an array
                if(launchObject[key].length == 0) {
                    launchObject[key] = null;
                }

            } else if(typeof launchObject[key] === "object") {
                // if field is an object
                setFieldsWithNoDataToNull(launchObject[key])

            } else if(invalidPrimitives.includes(launchObject[key])) {
                // field is a primitive 
                launchObject[key] = null;           
            }
        }
    }
    return launchObject;
}


export { loadLaunchesOverTime , getLaunchesAsList , getLaunchById , setFieldsWithNoDataToNull }
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
    const LAUNCHES_URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}`;
    try {
        let response = await axios.get(LAUNCHES_URL)

        // launches with missing info will not be included
        launches = response.data.results.map(launch => {
            let launchObject = {
                id: launch.id,
                launchName: launch.name,
                imageURL : launch.image.image_url,
                launchStatus : launch.status.abbrev,
                location : {
                    longitude : launch.pad.longitude,
                    latitude : launch.pad.latitude
                },
                launchDate : (launch.window_start == null) ? "Not Launched Yet" : launch.window_start,
            };

            if(hasMissingInfo(launchObject)) {
                return null;
            }
            return launchObject; 
        });

        // filters out launches with missing info
        launches = launches.filter(launch => {
            return launch != null;
        });

    } catch(error) {
        console.error('Error fetching launches', error);
    }
}

/**
 * Check if launch object has missing info.
 */
const hasMissingInfo = (launchObject) => {
    for(let key in launchObject) {
        if(launchObject.hasOwnProperty(key) && launchObject[key] == null) {
            return true;
        }
    }
    return false;
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


export { loadLaunchesOverTime , getLaunchesAsList , getLaunchById }
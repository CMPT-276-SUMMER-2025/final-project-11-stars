import axios from 'axios';

/**
 * Handles business logic and access to data in relation to orbital launches.
 */



/**
 * 
 * @param startDate Expected to be ISO 8601 format. 
 * @param endDate Expected to be ISO 8601 format.
 * @returns 
 */
const getLaunchesOverTime = async (startDate, endDate) => {
    const LAUNCHES_URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}`;
    try {
        let response = await axios.get(LAUNCHES_URL)
        return response.data.results;
    } catch(error) {
        console.error('Error fetching launches', error);
    }
}

export { getLaunchesOverTime }
import { getLaunchesOverTime } from "../model/launches.js"

// Dates are expected to be in ISO 8601 format
const getLaunches = async (startDate, endDate) => {
    return await getLaunchesOverTime(startDate, endDate);
}


export { getLaunches }